#!/bin/bash
# Spine Protocol Audit Script
# Augie uses this to audit artifacts against Spine compliance rules
#
# Usage:
#   spine-audit.sh /path/to/artifact           # Interactive output
#   spine-audit.sh /path/to/artifact --handoff # Generate copy-paste prompt
#   spine-audit.sh /path/to/artifact --slack   # Send handoff via Slack

GRIST_URL="http://10.0.0.33:3390"
GRIST_DOC="uNZG8PhepVScStYXVQKfR3"
GRIST_API_KEY="995830d80f0289d9abeed9819def97015211d9a3"
DEPLOYMENTS_MD="$HOME/Infrastructure/DEPLOYMENTS.md"

# Parse arguments
ARTIFACT_PATH=""
HANDOFF_MODE=false
SLACK_MODE=false

for arg in "$@"; do
    case $arg in
        --handoff)
            HANDOFF_MODE=true
            ;;
        --slack)
            SLACK_MODE=true
            ;;
        *)
            ARTIFACT_PATH="$arg"
            ;;
    esac
done

ARTIFACT_PATH="${ARTIFACT_PATH:-.}"

# Detect artifact type
detect_type() {
    local path="$1"
    if [[ -f "$path/docker-compose.yml" ]] || [[ -f "$path/stack.yml" ]]; then
        echo "deployment"
    elif [[ -f "$path/workflow-v"*.json ]] 2>/dev/null || [[ "$path" == *"/n8n/"* ]]; then
        echo "n8n-workflow"
    elif [[ -f "$path/"*.sh ]]; then
        echo "script"
    elif [[ "$path" == *"one-offs/active/"* ]]; then
        echo "one-off"
    elif [[ -f "$path/PROTOCOL.md" ]]; then
        echo "protocol"
    else
        echo "unknown"
    fi
}

get_name() { basename "$1"; }

# Colors (disabled in handoff/slack mode)
if [[ "$HANDOFF_MODE" == "true" ]] || [[ "$SLACK_MODE" == "true" ]]; then
    RED=''; GREEN=''; YELLOW=''; NC=''
else
    RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; NC='\033[0m'
fi

# Findings storage
declare -a CRITICAL_FINDINGS=()
declare -a WARNING_FINDINGS=()
declare -a PASS_FINDINGS=()

record_critical() { CRITICAL_FINDINGS+=("$1"); }
record_warning() { WARNING_FINDINGS+=("$1"); }
record_pass() { PASS_FINDINGS+=("$1"); }

# Resolve path
ARTIFACT_PATH=$(cd "$ARTIFACT_PATH" 2>/dev/null && pwd || echo "$ARTIFACT_PATH")
ARTIFACT_NAME=$(get_name "$ARTIFACT_PATH")
ARTIFACT_TYPE=$(detect_type "$ARTIFACT_PATH")

# Run checks (silent in handoff mode)
run_checks() {
    # SPINE-001: Documentation exists
    if [[ -f "$ARTIFACT_PATH/objectives.md" ]] || [[ -f "$ARTIFACT_PATH/overview.md" ]] || [[ -f "$ARTIFACT_PATH/admin.md" ]]; then
        record_pass "SPINE-001: Documentation exists"
    else
        record_critical "SPINE-001: No objectives.md, overview.md, or admin.md - create documentation at $ARTIFACT_PATH/"
    fi

    # SPINE-002: Status documented
    if grep -qiE "status:|## Status" "$ARTIFACT_PATH"/*.md 2>/dev/null; then
        record_pass "SPINE-002: Status indicator found"
    else
        record_warning "SPINE-002: No status indicator in documentation"
    fi

    # Type-specific checks
    if [[ "$ARTIFACT_TYPE" == "deployment" ]]; then
        # SPINE-011: DEPLOYMENTS.md entry
        if grep -qi "$ARTIFACT_NAME" "$DEPLOYMENTS_MD" 2>/dev/null; then
            record_pass "SPINE-011: Found in DEPLOYMENTS.md"
        else
            record_critical "SPINE-011: Not in DEPLOYMENTS.md - add entry to ~/Infrastructure/DEPLOYMENTS.md"
        fi

        # SPINE-010: Grist Deployments entry
        GRIST_RESULT=$(curl -s "${GRIST_URL}/api/docs/${GRIST_DOC}/tables/Deployments/records" \
            -H "Authorization: Bearer ${GRIST_API_KEY}" 2>/dev/null | \
            grep -i "$ARTIFACT_NAME" || true)
        if [[ -n "$GRIST_RESULT" ]]; then
            record_pass "SPINE-010: Registered in Grist Deployments"
        else
            record_critical "SPINE-010: Not in Grist Deployments table - add via Grist API"
        fi

        # SPINE-032: admin.md exists
        if [[ -f "$ARTIFACT_PATH/admin.md" ]]; then
            record_pass "SPINE-032: admin.md exists"
        else
            record_warning "SPINE-032: No admin.md for maintainers"
        fi

    elif [[ "$ARTIFACT_TYPE" == "n8n-workflow" ]]; then
        # SPINE-013: n8n README entry
        N8N_README="/mnt/foundry_resources/n8n/README.md"
        if grep -qi "$ARTIFACT_NAME" "$N8N_README" 2>/dev/null; then
            record_pass "SPINE-013: Found in n8n README"
        else
            record_warning "SPINE-013: Not in n8n README.md"
        fi

        # SPINE-012: Grist N8n_Workflows entry
        GRIST_RESULT=$(curl -s "${GRIST_URL}/api/docs/${GRIST_DOC}/tables/N8n_Workflows/records" \
            -H "Authorization: Bearer ${GRIST_API_KEY}" 2>/dev/null | \
            grep -i "$ARTIFACT_NAME" || true)
        if [[ -n "$GRIST_RESULT" ]]; then
            record_pass "SPINE-012: Registered in Grist N8n_Workflows"
        else
            record_critical "SPINE-012: Not in Grist N8n_Workflows table - add entry or fix naming mismatch"
        fi

        # SPINE-031: systems.md exists
        if [[ -f "$ARTIFACT_PATH/systems.md" ]]; then
            record_pass "SPINE-031: systems.md exists"
        else
            record_warning "SPINE-031: No systems.md for consumers"
        fi
    fi
}

# Output: Interactive mode
output_interactive() {
    echo "=== SPINE AUDIT: $ARTIFACT_NAME ==="
    echo "Path: $ARTIFACT_PATH"
    echo "Type: $ARTIFACT_TYPE"
    echo "Time: $(date -Iseconds)"
    echo ""

    echo "--- Findings ---"
    for f in "${CRITICAL_FINDINGS[@]}"; do
        echo -e "${RED}CRITICAL${NC} - $f"
    done
    for f in "${WARNING_FINDINGS[@]}"; do
        echo -e "${YELLOW}WARNING${NC} - $f"
    done
    for f in "${PASS_FINDINGS[@]}"; do
        echo -e "${GREEN}PASS${NC} - $f"
    done

    echo ""
    echo "=== VERDICT ==="
    if [[ ${#CRITICAL_FINDINGS[@]} -gt 0 ]]; then
        echo -e "${RED}FAIL${NC}"
    else
        echo -e "${GREEN}PASS${NC}"
    fi
    echo ""
    echo "CRITICAL: ${#CRITICAL_FINDINGS[@]}"
    echo "WARNING: ${#WARNING_FINDINGS[@]}"
}

# Output: Handoff mode (copy-paste prompt)
output_handoff() {
    echo "---"
    echo ""
    echo "## Spine Audit: $ARTIFACT_NAME"
    echo ""
    echo "**Type:** $ARTIFACT_TYPE"
    echo "**Path:** \`$ARTIFACT_PATH\`"
    echo ""

    if [[ ${#CRITICAL_FINDINGS[@]} -gt 0 ]]; then
        echo "### CRITICAL (must fix)"
        echo ""
        for f in "${CRITICAL_FINDINGS[@]}"; do
            echo "- $f"
        done
        echo ""
    fi

    if [[ ${#WARNING_FINDINGS[@]} -gt 0 ]]; then
        echo "### WARNING (should fix)"
        echo ""
        for f in "${WARNING_FINDINGS[@]}"; do
            echo "- $f"
        done
        echo ""
    fi

    echo "### Verify after fixing"
    echo ""
    echo "\`\`\`bash"
    echo "~/Infrastructure/_bmad/_memory/augie-sidecar/scripts/spine-audit.sh $ARTIFACT_PATH"
    echo "\`\`\`"
    echo ""
    echo "---"
}

# Output: Slack mode (send via webhook)
output_slack() {
    if [[ ${#CRITICAL_FINDINGS[@]} -eq 0 ]] && [[ ${#WARNING_FINDINGS[@]} -eq 0 ]]; then
        echo "✓ Audit passed - no handoff needed"
        return 0
    fi

    local message="*Spine Audit: $ARTIFACT_NAME*\n"
    message+="Type: $ARTIFACT_TYPE\n"
    message+="Path: \`$ARTIFACT_PATH\`\n\n"

    if [[ ${#CRITICAL_FINDINGS[@]} -gt 0 ]]; then
        message+="*CRITICAL:*\n"
        for f in "${CRITICAL_FINDINGS[@]}"; do
            message+="• $f\n"
        done
    fi

    if [[ ${#WARNING_FINDINGS[@]} -gt 0 ]]; then
        message+="*WARNING:*\n"
        for f in "${WARNING_FINDINGS[@]}"; do
            message+="• $f\n"
        done
    fi

    message+="\n_Verify: \`spine-audit.sh $ARTIFACT_PATH\`_"

    ~/Infrastructure/scripts/send-reminder.sh \
        "Spine Audit: $ARTIFACT_NAME" \
        "$message" \
        "📋"
}

# Main
run_checks

if [[ "$SLACK_MODE" == "true" ]]; then
    output_slack
elif [[ "$HANDOFF_MODE" == "true" ]]; then
    output_handoff
else
    output_interactive
fi

# Exit code
if [[ ${#CRITICAL_FINDINGS[@]} -gt 0 ]]; then
    exit 1
else
    exit 0
fi
