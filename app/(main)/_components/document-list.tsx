'use client';

import { useState } from 'react';

import { useQuery } from 'convex/react';
import { FileIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import ConditionalRendering from '@/components/conditional-rendering';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';

import NavItem from './nav-item';

interface DocumentListProps {
  parentDocumentId?: Id<'documents'>;
  level?: number;
  data?: Doc<'documents'>[];
}

export const DocumentList = ({
  parentDocumentId,
  level = 0,
  data,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const onExpand = (documentId: string) => {
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [documentId]: !prevExpanded[documentId],
    }));
  };

  const documents = useQuery(api.documents.getSideBar, {
    parentDocument: parentDocumentId,
  });

  const onRedirect = (documentId: string) => {
    router.push(`/documents/${documentId}`);
  };

  // If documents is not defined, it means that the query is being loaded
  if (documents === undefined) {
    return (
      <>
        <NavItem.Skeleton level={level} />
        {level === 0 && (
          <>
            <NavItem.Skeleton level={level} />
            <NavItem.Skeleton level={level} />
          </>
        )}
      </>
    );
  }

  return (
    <>
      <p
        style={{ paddingLeft: level ? `${level * 12 + 25}px` : '0px' }}
        className={cn(
          'hidden text-sm text-muted-foreground/80 font-medium',
          expanded && 'last:block',
          level === 0 && 'hidden'
        )}
      >
        No pages inside
      </p>
      {documents.map(({ _id, title, icon }) => (
        <div key={_id}>
          <NavItem
            id={_id}
            onClick={() => onRedirect(_id)}
            label={title}
            icon={FileIcon}
            documentIcon={icon}
            active={params.documentId === _id}
            level={level}
            onExpand={() => onExpand(_id)}
            expanded={expanded[_id]}
          />

          <ConditionalRendering
            condition={!!expanded[_id]}
            render={<DocumentList parentDocumentId={_id} level={level + 1} />}
          />
        </div>
      ))}
    </>
  );
};
