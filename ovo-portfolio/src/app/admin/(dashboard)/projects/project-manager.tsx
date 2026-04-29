'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { EditCard } from '@/components/admin/edit-card';
import { AdminProjectCard } from './admin-project-card';
import { ProjectForm } from './project-form';
import { reorderProjects } from './actions';
import type { AdminProject, AdminSkill } from '@/lib/admin-queries';

interface ProjectManagerProps {
  items: AdminProject[];
  skills: AdminSkill[];
}

export function ProjectManager({ items, skills }: ProjectManagerProps) {
  const [addingNew, setAddingNew] = useState(false);
  const [orderedItems, setOrderedItems] = useState<AdminProject[]>(items);
  const [, startTransition] = useTransition();
  const t = useTranslations('admin');

  // Sync local state when server props change (after revalidate or first load)
  useEffect(() => {
    setOrderedItems(items);
  }, [items]);

  const pinnedItems = useMemo(
    () => orderedItems.filter((p) => p.pinned),
    [orderedItems]
  );
  const unpinnedItems = useMemo(
    () => orderedItems.filter((p) => !p.pinned),
    [orderedItems]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeItem = orderedItems.find((p) => p.id === active.id);
    const overItem = orderedItems.find((p) => p.id === over.id);
    if (!activeItem || !overItem) return;
    // Ignore cross-group drops (pinned ↔ unpinned)
    if (activeItem.pinned !== overItem.pinned) return;

    const groupItems = activeItem.pinned ? pinnedItems : unpinnedItems;
    const oldIndex = groupItems.findIndex((p) => p.id === active.id);
    const newIndex = groupItems.findIndex((p) => p.id === over.id);
    if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return;

    const reorderedGroup = arrayMove(groupItems, oldIndex, newIndex);
    const otherGroup = activeItem.pinned ? unpinnedItems : pinnedItems;

    // Optimistic local update
    const nextLocal = activeItem.pinned
      ? [...reorderedGroup, ...otherGroup]
      : [...otherGroup, ...reorderedGroup];
    setOrderedItems(nextLocal);

    // Persist new order indices for the affected group only
    const updates = reorderedGroup.map((p, idx) => ({ id: p.id, order: idx }));
    startTransition(() => {
      void reorderProjects(updates);
    });
  };

  return (
    <div className="space-y-4">
      {orderedItems.length === 0 && !addingNew ? (
        <p className="rounded-sm border border-dashed border-border bg-background-subtle px-4 py-8 text-center text-caption text-foreground-subtle">
          {t('projects.empty')}
        </p>
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {pinnedItems.length > 0 ? (
          <section className="space-y-2">
            <h2 className="font-mono text-caption text-foreground-subtle">
              {t('projects.pinnedGroup')}
            </h2>
            <SortableContext
              items={pinnedItems.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3">
                {pinnedItems.map((p) => (
                  <AdminProjectCard key={p.id} project={p} skills={skills} />
                ))}
              </ul>
            </SortableContext>
          </section>
        ) : null}

        {unpinnedItems.length > 0 ? (
          <section className="space-y-2">
            {pinnedItems.length > 0 ? (
              <h2 className="mt-6 font-mono text-caption text-foreground-subtle">
                {t('projects.unpinnedGroup')}
              </h2>
            ) : null}
            <SortableContext
              items={unpinnedItems.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <ul className="space-y-3">
                {unpinnedItems.map((p) => (
                  <AdminProjectCard key={p.id} project={p} skills={skills} />
                ))}
              </ul>
            </SortableContext>
          </section>
        ) : null}
      </DndContext>

      {addingNew ? (
        <EditCard>
          <header className="mb-6">
            <h3 className="text-h3 text-foreground">{t('projects.newItem')}</h3>
          </header>
          <ProjectForm
            skills={skills}
            onSuccess={() => setAddingNew(false)}
            onCancel={() => setAddingNew(false)}
          />
        </EditCard>
      ) : (
        <button
          type="button"
          onClick={() => setAddingNew(true)}
          className="inline-flex h-10 items-center gap-1.5 rounded-sm border border-dashed border-border bg-transparent px-4 text-body text-foreground-muted transition-colors duration-150 hover:border-border-strong hover:bg-background-subtle hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-strong)]"
        >
          <Plus className="h-4 w-4" aria-hidden />
          <span>{t('projects.addNew')}</span>
        </button>
      )}
    </div>
  );
}
