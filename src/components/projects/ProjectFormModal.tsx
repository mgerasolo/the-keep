'use client';

/**
 * Project Form Modal
 * Create and edit projects
 */

import { useState, useEffect } from 'react';
import { Modal, ModalFooter } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { api } from '@/lib/trpc/react';
import { toast } from '@/components/ui/toaster';
import { useProjectStore } from '@/stores';

// Common project emojis
const PROJECT_ICONS = ['📁', '📚', '💡', '🎯', '🚀', '💼', '🏠', '🎨', '🔬', '📝', '🌱', '⚡'];

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editProject?: {
    id: string;
    name: string;
    icon: string | null;
    description: string | null;
  } | null;
}

export function ProjectFormModal({ isOpen, onClose, editProject }: ProjectFormModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📁');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{ name?: string }>({});

  const utils = api.useUtils();
  const { setActiveProject } = useProjectStore();

  // Reset form when modal opens/closes or edit project changes
  useEffect(() => {
    if (isOpen) {
      if (editProject) {
        setName(editProject.name);
        setIcon(editProject.icon ?? '📁');
        setDescription(editProject.description ?? '');
      } else {
        setName('');
        setIcon('📁');
        setDescription('');
      }
      setErrors({});
    }
  }, [isOpen, editProject]);

  const createMutation = api.projects.create.useMutation({
    onSuccess: (project) => {
      toast.success(`Created "${project.name}"`);
      utils.projects.list.invalidate();
      setActiveProject({
        id: project.id,
        name: project.name,
        icon: project.icon ?? '📁',
        description: project.description,
      });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateMutation = api.projects.update.useMutation({
    onSuccess: (project) => {
      toast.success(`Updated "${project.name}"`);
      utils.projects.list.invalidate();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    const newErrors: { name?: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Project name is required';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editProject) {
      updateMutation.mutate({
        id: editProject.id,
        name: name.trim(),
        icon,
        description: description.trim() || undefined,
      });
    } else {
      createMutation.mutate({
        name: name.trim(),
        icon,
        description: description.trim() || undefined,
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editProject ? 'Edit Project' : 'New Project'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Icon picker */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Icon</label>
          <div className="flex flex-wrap gap-2">
            {PROJECT_ICONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setIcon(emoji)}
                className={`w-10 h-10 flex items-center justify-center text-xl rounded-lg transition-colors ${
                  icon === emoji
                    ? 'bg-accent text-white'
                    : 'bg-surface hover:bg-surface-hover'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="My Knowledge Base"
          error={errors.name}
          autoFocus
        />

        {/* Description */}
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this project about?"
          rows={3}
        />

        <ModalFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {editProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
