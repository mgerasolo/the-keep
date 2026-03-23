"use client";

import { useState, useEffect, useMemo } from "react";
import { IDockviewPanelProps } from "dockview-react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Link2,
  Code,
  Table,
  Image,
  Quote,
  CheckSquare,
  Eye,
  Edit3,
  Split,
  Save,
  MoreHorizontal,
  Hash,
  Calendar,
  BookOpen,
  Folder,
  Clock,
  ChevronRight,
  ChevronDown,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkspaceStore, FileNode } from "@/stores/workspace";

type ViewMode = "edit" | "preview" | "split";

interface ToolbarButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
  active?: boolean;
}

function ToolbarButton({ icon, title, onClick, active }: ToolbarButtonProps) {
  return (
    <button
      className={cn(
        "p-1.5 rounded hover:bg-secondary transition-colors",
        active && "bg-secondary"
      )}
      title={title}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

interface FrontmatterProps {
  content: string;
}

function FrontmatterDisplay({ content }: FrontmatterProps) {
  // Parse frontmatter from content
  const frontmatter = useMemo(() => {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return null;

    const parsed: Record<string, string> = {};
    match[1].split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length) {
        parsed[key.trim()] = valueParts.join(":").trim();
      }
    });
    return parsed;
  }, [content]);

  if (!frontmatter) return null;

  return (
    <div className="frontmatter mx-4 mt-4">
      {frontmatter.tags && (
        <div className="frontmatter-field">
          <Hash className="w-3 h-3 text-muted-foreground" />
          <span className="frontmatter-key">Tags:</span>
          <div className="flex flex-wrap gap-1">
            {frontmatter.tags.split(",").map((tag, i) => (
              <span key={i} className="frontmatter-tag">
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      )}
      {frontmatter.date && (
        <div className="frontmatter-field">
          <Calendar className="w-3 h-3 text-muted-foreground" />
          <span className="frontmatter-key">Date:</span>
          <span className="frontmatter-value">{frontmatter.date}</span>
        </div>
      )}
      {frontmatter.source && (
        <div className="frontmatter-field">
          <BookOpen className="w-3 h-3 text-muted-foreground" />
          <span className="frontmatter-key">Source:</span>
          <span className="frontmatter-value">{frontmatter.source}</span>
        </div>
      )}
    </div>
  );
}

interface EditorWithLineNumbersProps {
  content: string;
  onChange: (value: string) => void;
  showLineNumbers: boolean;
}

// Cursor-style syntax highlighting colors
const SYNTAX_COLORS = {
  key: "#9CDCFE",       // Cyan - YAML keys
  string: "#CE9178",    // Orange - string values
  number: "#B5CEA8",    // Green - numbers
  h1: "#D7BA7D",        // Gold - H1 headers
  h2: "#DCDCAA",        // Yellow - H2 headers
  h3: "#E2C08D",        // Light gold - H3 headers
  listMarker: "#6796E6", // Blue - list markers
  bold: "#FFFFFF",      // White - bold text
  delimiter: "#6A9955", // Gray-green - frontmatter delimiters
  link: "#4EC9B0",      // Teal - links
  code: "#CE9178",      // Magenta - inline code
};

function CursorStyleEditor({ content, onChange, showLineNumbers }: EditorWithLineNumbersProps) {
  const [collapsedHeaders, setCollapsedHeaders] = useState<Set<number>>(new Set());
  const lines = content.split("\n");

  const toggleHeader = (lineIndex: number) => {
    setCollapsedHeaders(prev => {
      const next = new Set(prev);
      if (next.has(lineIndex)) {
        next.delete(lineIndex);
      } else {
        next.add(lineIndex);
      }
      return next;
    });
  };

  const getHeaderLevel = (line: string): number => {
    const match = line.match(/^(#{1,6})\s/);
    return match ? match[1].length : 0;
  };

  const getIndentLevel = (line: string): number => {
    const match = line.match(/^(\s*)/);
    return match ? Math.floor(match[1].length / 2) : 0;
  };

  const isLineVisible = (lineIndex: number): boolean => {
    // Check if any header above this line is collapsed
    for (let i = lineIndex - 1; i >= 0; i--) {
      if (collapsedHeaders.has(i)) {
        const headerLevel = getHeaderLevel(lines[i]);
        if (headerLevel > 0) {
          // Check if current line is under this header
          const currentHeaderLevel = getHeaderLevel(lines[lineIndex]);
          if (currentHeaderLevel === 0 || currentHeaderLevel > headerLevel) {
            return false;
          }
          break;
        }
      }
    }
    return true;
  };

  const renderSyntaxLine = (line: string, index: number) => {
    const indentLevel = getIndentLevel(line);
    const headerLevel = getHeaderLevel(line);
    const isHeader = headerLevel > 0;
    const isCollapsed = collapsedHeaders.has(index);

    // Frontmatter delimiter
    if (line === "---") {
      return <span style={{ color: SYNTAX_COLORS.delimiter }}>{line}</span>;
    }

    // Headers with colors
    if (line.startsWith("# ")) {
      return <span style={{ color: SYNTAX_COLORS.h1, fontWeight: "bold" }}>{line}</span>;
    }
    if (line.startsWith("## ")) {
      return <span style={{ color: SYNTAX_COLORS.h2, fontWeight: "bold" }}>{line}</span>;
    }
    if (line.startsWith("### ")) {
      return <span style={{ color: SYNTAX_COLORS.h3, fontWeight: "bold" }}>{line}</span>;
    }

    // YAML key-value in frontmatter
    if (line.includes(":") && !line.startsWith("#") && !line.startsWith("-")) {
      const colonIndex = line.indexOf(":");
      const key = line.substring(0, colonIndex);
      const value = line.substring(colonIndex + 1);

      // Check if value looks like a number
      const trimmedValue = value.trim();
      const isNumber = /^\d+$/.test(trimmedValue);
      const isArray = trimmedValue.startsWith("[");

      return (
        <>
          <span style={{ color: SYNTAX_COLORS.key }}>{key}</span>
          <span style={{ color: "#808080" }}>:</span>
          <span style={{ color: isNumber ? SYNTAX_COLORS.number : isArray ? "#DCDCAA" : SYNTAX_COLORS.string }}>
            {value}
          </span>
        </>
      );
    }

    // List items
    if (line.trimStart().startsWith("- ")) {
      const leadingSpaces = line.match(/^(\s*)/)?.[1] || "";
      const rest = line.trimStart().slice(2);
      return (
        <>
          <span>{leadingSpaces}</span>
          <span style={{ color: SYNTAX_COLORS.listMarker }}>- </span>
          <span>{renderInlineFormatting(rest)}</span>
        </>
      );
    }

    // Bold text inline
    return <span>{renderInlineFormatting(line)}</span>;
  };

  const renderInlineFormatting = (text: string) => {
    // Simple bold detection
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <span key={i} style={{ color: SYNTAX_COLORS.bold, fontWeight: "bold" }}>{part}</span>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="flex h-full font-mono text-sm">
      {/* Line numbers + fold indicators */}
      {showLineNumbers && (
        <div className="select-none bg-[#1e1e1e] flex flex-col py-2">
          {lines.map((line, i) => {
            if (!isLineVisible(i)) return null;
            const headerLevel = getHeaderLevel(line);
            const isHeader = headerLevel > 0;
            const isCollapsed = collapsedHeaders.has(i);

            return (
              <div key={i} className="flex items-center h-6 leading-6">
                {/* Line number */}
                <span className="w-10 text-right pr-2 text-[#5a5a5a]">{i + 1}</span>
                {/* Fold indicator */}
                <span className="w-4 flex items-center justify-center">
                  {isHeader && (
                    <button
                      onClick={() => toggleHeader(i)}
                      className="text-[#6a6a6a] hover:text-foreground"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Indent guides + content */}
      <div className="flex-1 overflow-auto py-2 pl-1">
        {lines.map((line, i) => {
          if (!isLineVisible(i)) return null;
          const indentLevel = getIndentLevel(line);

          return (
            <div key={i} className="h-6 leading-6 flex relative">
              {/* Indent guide lines */}
              {indentLevel > 0 && (
                <div className="absolute left-0 top-0 bottom-0 flex">
                  {Array.from({ length: indentLevel }, (_, j) => (
                    <div
                      key={j}
                      className="w-4 border-l border-[#333] ml-4"
                      style={{ marginLeft: j === 0 ? "0.5rem" : "0" }}
                    />
                  ))}
                </div>
              )}
              {/* Line content */}
              <div className="pl-1">
                {renderSyntaxLine(line, i)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hidden textarea for actual editing */}
      <textarea
        className="absolute opacity-0 pointer-events-none"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}

// Keep the simple editor as fallback
function EditorWithLineNumbers({ content, onChange, showLineNumbers }: EditorWithLineNumbersProps) {
  const lines = content.split("\n");
  const lineCount = lines.length;

  return (
    <div className="flex h-full">
      {/* Line numbers */}
      {showLineNumbers && (
        <div className="editor-line-numbers select-none border-r border-border bg-editor-bg px-2 py-4">
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1} className="leading-6 text-right pr-2">
              {i + 1}
            </div>
          ))}
        </div>
      )}

      {/* Editor */}
      <textarea
        className="flex-1 p-4 bg-transparent text-foreground font-mono text-sm resize-none focus:outline-none leading-6"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
      />
    </div>
  );
}

function SyntaxHighlightedLine({ line, index }: { line: string; index: number }) {
  // Headers
  if (line.startsWith("# ")) {
    return (
      <div key={index} className="text-[#569cd6] font-bold text-2xl mt-6 mb-4">
        {line}
      </div>
    );
  }
  if (line.startsWith("## ")) {
    return (
      <div key={index} className="text-[#569cd6] font-bold text-xl mt-5 mb-3">
        {line}
      </div>
    );
  }
  if (line.startsWith("### ")) {
    return (
      <div key={index} className="text-[#569cd6] font-bold text-lg mt-4 mb-2">
        {line}
      </div>
    );
  }

  // Frontmatter delimiter
  if (line === "---") {
    return <div key={index} className="text-muted-foreground">{line}</div>;
  }

  // List items
  if (line.startsWith("- ")) {
    return (
      <div key={index} className="ml-4">
        <span className="text-[#6796e6]">- </span>
        <span>{line.slice(2)}</span>
      </div>
    );
  }

  // Table rows
  if (line.startsWith("|")) {
    return (
      <div key={index} className="font-mono text-foreground">
        {line.split("|").map((cell, i) => (
          <span key={i}>
            {i > 0 && <span className="text-muted-foreground">|</span>}
            {cell}
          </span>
        ))}
      </div>
    );
  }

  // Frontmatter key-value
  if (line.includes(":") && !line.startsWith("#")) {
    const [key, ...rest] = line.split(":");
    const value = rest.join(":");
    return (
      <div key={index}>
        <span className="text-[#9cdcfe]">{key}</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-[#ce9178]">{value}</span>
      </div>
    );
  }

  // Empty line
  if (!line.trim()) {
    return <div key={index} className="h-6" />;
  }

  // Regular text
  return <div key={index}>{line}</div>;
}

function SyntaxHighlightedPreview({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="p-4 font-mono text-sm leading-6">
      {lines.map((line, index) => (
        <SyntaxHighlightedLine key={index} line={line} index={index} />
      ))}
    </div>
  );
}

function MarkdownPreview({ content }: { content: string }) {
  const renderMarkdown = (md: string) => {
    // Remove frontmatter
    md = md.replace(/^---\n[\s\S]*?\n---\n/, "");

    const lines = md.split("\n");
    const elements: React.ReactNode[] = [];
    let inTable = false;
    let tableRows: string[][] = [];

    const processLine = (line: string, index: number) => {
      // Headers
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-2xl font-bold mt-6 mb-4">
            {line.slice(2)}
          </h1>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-xl font-semibold mt-5 mb-3">
            {line.slice(3)}
          </h2>
        );
      }
      if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-lg font-medium mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      }

      // List items
      if (line.startsWith("- ")) {
        return (
          <li key={index} className="ml-4">
            {line.slice(2)}
          </li>
        );
      }

      // Table handling
      if (line.startsWith("|")) {
        if (!inTable) {
          inTable = true;
          tableRows = [];
        }
        if (!line.includes("---")) {
          const cells = line
            .split("|")
            .filter((c) => c.trim())
            .map((c) => c.trim());
          tableRows.push(cells);
        }
        return null;
      } else if (inTable) {
        inTable = false;
        const table = (
          <table
            key={`table-${index}`}
            className="w-full border-collapse my-4 text-sm"
          >
            <thead>
              <tr className="bg-secondary">
                {tableRows[0]?.map((cell, i) => (
                  <th key={i} className="border border-border px-3 py-2 text-left">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="border border-border px-3 py-2">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        );
        tableRows = [];
        return table;
      }

      if (line.trim() === "") {
        return <br key={index} />;
      }

      return (
        <p key={index} className="my-2">
          {line}
        </p>
      );
    };

    lines.forEach((line, index) => {
      const element = processLine(line, index);
      if (element) {
        elements.push(element);
      }
    });

    // Handle unclosed table
    if (inTable && tableRows.length > 0) {
      elements.push(
        <table key="final-table" className="w-full border-collapse my-4 text-sm">
          <thead>
            <tr className="bg-secondary">
              {tableRows[0]?.map((cell, i) => (
                <th key={i} className="border border-border px-3 py-2 text-left">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-border px-3 py-2">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    return elements;
  };

  return (
    <div className="prose prose-invert max-w-none p-4">
      {renderMarkdown(content)}
    </div>
  );
}

export function MarkdownEditor(props: IDockviewPanelProps) {
  const { files, showLineNumbers, setTabDirty } = useWorkspaceStore();
  const fileId = props.params.fileId as string;
  const [viewMode, setViewMode] = useState<ViewMode>("edit");
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileNode | null>(null);

  // Find file content
  useEffect(() => {
    const findFile = (nodes: FileNode[]): FileNode | undefined => {
      for (const node of nodes) {
        if (node.id === fileId) return node;
        if (node.children) {
          const found = findFile(node.children);
          if (found) return found;
        }
      }
      return undefined;
    };
    const file = findFile(files);
    if (file) {
      setCurrentFile(file);
      if (file.content) {
        setContent(file.content);
      }
    }
  }, [fileId, files]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setIsDirty(true);
  };

  return (
    <div className="h-full flex flex-col bg-editor-bg">
      {/* Breadcrumb Path Bar (Cursor-style) */}
      {currentFile && (
        <div className="h-7 bg-[#1e1e1e] border-b border-border flex items-center justify-between px-3 text-xs">
          {/* Breadcrumb path (left) */}
          <div className="flex items-center gap-1 text-muted-foreground">
            {(currentFile.path || `/${currentFile.name}`).split('/').filter(Boolean).map((segment, i, arr) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3 text-muted-foreground/50" />}
                <button className="hover:text-foreground hover:underline transition-colors">
                  {i === arr.length - 1 ? (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3 text-purple-400" />
                      <span className={isDirty ? "text-orange-400" : "text-foreground"}>
                        {isDirty && "M# "}{segment}
                      </span>
                    </span>
                  ) : segment}
                </button>
              </span>
            ))}
            <span className="text-muted-foreground/50 ml-1">&gt; ...</span>
          </div>

          {/* Preview/Markdown toggle (right) */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className={cn(
                "px-2 py-0.5 rounded text-xs transition-colors",
                viewMode === "preview" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setViewMode("preview")}
            >
              Preview
            </button>
            <button
              className={cn(
                "px-2 py-0.5 rounded text-xs transition-colors",
                viewMode === "edit" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setViewMode("edit")}
            >
              Markdown
            </button>
          </div>
        </div>
      )}

      {/* Formatting Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b border-border bg-card">
        {/* Formatting tools */}
        <div className="flex items-center gap-0.5">
          <ToolbarButton icon={<Bold className="w-4 h-4" />} title="Bold (Cmd+B)" />
          <ToolbarButton
            icon={<Italic className="w-4 h-4" />}
            title="Italic (Cmd+I)"
          />
          <ToolbarButton icon={<Code className="w-4 h-4" />} title="Code" />
          <ToolbarButton icon={<Link2 className="w-4 h-4" />} title="Link" />
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton icon={<Heading1 className="w-4 h-4" />} title="Heading 1" />
          <ToolbarButton icon={<Heading2 className="w-4 h-4" />} title="Heading 2" />
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton icon={<List className="w-4 h-4" />} title="Bullet List" />
          <ToolbarButton
            icon={<ListOrdered className="w-4 h-4" />}
            title="Numbered List"
          />
          <ToolbarButton icon={<CheckSquare className="w-4 h-4" />} title="Task List" />
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton icon={<Table className="w-4 h-4" />} title="Table" />
          <ToolbarButton icon={<Image className="w-4 h-4" />} title="Image" />
          <ToolbarButton icon={<Quote className="w-4 h-4" />} title="Quote" />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* View mode toggles */}
        <div className="flex items-center gap-0.5 bg-secondary rounded p-0.5">
          <ToolbarButton
            icon={<Edit3 className="w-4 h-4" />}
            title="Edit Mode"
            active={viewMode === "edit"}
            onClick={() => setViewMode("edit")}
          />
          <ToolbarButton
            icon={<Split className="w-4 h-4" />}
            title="Split Mode"
            active={viewMode === "split"}
            onClick={() => setViewMode("split")}
          />
          <ToolbarButton
            icon={<Eye className="w-4 h-4" />}
            title="Preview Mode"
            active={viewMode === "preview"}
            onClick={() => setViewMode("preview")}
          />
        </div>

        <div className="w-px h-4 bg-border mx-1" />

        {/* Save indicator */}
        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              Unsaved
            </span>
          )}
          <ToolbarButton
            icon={<Save className="w-4 h-4" />}
            title="Save (Cmd+S)"
            onClick={() => setIsDirty(false)}
          />
          <ToolbarButton
            icon={<MoreHorizontal className="w-4 h-4" />}
            title="More actions"
          />
        </div>
      </div>

      {/* Frontmatter display */}
      {viewMode !== "preview" && <FrontmatterDisplay content={content} />}

      {/* Editor/Preview Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {(viewMode === "edit" || viewMode === "split") && (
          <div
            className={cn(
              "flex-1 overflow-auto relative",
              viewMode === "split" && "border-r border-border"
            )}
          >
            <CursorStyleEditor
              content={content}
              onChange={handleContentChange}
              showLineNumbers={showLineNumbers}
            />
          </div>
        )}

        {/* Preview */}
        {(viewMode === "preview" || viewMode === "split") && (
          <div className="flex-1 overflow-auto">
            {viewMode === "split" ? (
              <SyntaxHighlightedPreview content={content} />
            ) : (
              <MarkdownPreview content={content} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
