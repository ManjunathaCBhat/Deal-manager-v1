import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableDealCard({ deal, stage }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: deal.id,
      data: { deal, stage },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`p-4 rounded-lg border bg-white shadow-sm transition-all cursor-grab ${
        isDragging
          ? "shadow-xl scale-[1.03] opacity-90 border-blue-300"
          : "hover:shadow-md"
      }`}
    >
      <h3 className="font-semibold text-gray-800">{deal.title}</h3>
      <p className="text-sm text-gray-500">${deal.amount}</p>
      <p className="text-xs text-gray-400 mt-1">{deal.company_name}</p>
    </div>
  );
}
