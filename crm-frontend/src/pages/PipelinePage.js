import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Layout from "../components/Layout";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

const STAGES = [
  { key: "prospecting", label: "Prospecting", color: "#1e90ff" },
  { key: "qualification", label: "Qualification", color: "#f1c40f" },
  { key: "proposal", label: "Proposal", color: "#e67e22" },
  { key: "negotiation", label: "Negotiation", color: "#e74c3c" },
];

const PipelinePage = () => {
  const [columns, setColumns] = useState({
    prospecting: [],
    qualification: [],
    proposal: [],
    negotiation: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/deals/");
      const grouped = {
        prospecting: [],
        qualification: [],
        proposal: [],
        negotiation: [],
      };

      res.data.forEach((deal) => {
        const stage = deal.stage?.toLowerCase();
        if (grouped[stage]) {
          grouped[stage].push(deal);
        }
      });

      setColumns(grouped);
    } catch (e) {
      console.error("Pipeline fetch error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const updateDealStage = async (dealId, newStage) => {
    try {
      await api.patch(`/api/deals/${dealId}/`, { stage: newStage });
    } catch (err) {
      console.error("Stage update failed:", err);
    }
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceStage = source.droppableId;
    const destStage = destination.droppableId;

    const sourceItems = Array.from(columns[sourceStage]);
    const destItems =
      sourceStage === destStage
        ? sourceItems
        : Array.from(columns[destStage]);

    const [moved] = sourceItems.splice(source.index, 1);

    if (sourceStage === destStage) {
      // Reorder in same column
      destItems.splice(destination.index, 0, moved);
      setColumns((prev) => ({
        ...prev,
        [sourceStage]: destItems,
      }));
    } else {
      // Move across columns
      destItems.splice(destination.index, 0, { ...moved, stage: destStage });
      setColumns((prev) => ({
        ...prev,
        [sourceStage]: sourceItems,
        [destStage]: destItems,
      }));
      // backend update
      try {
        await updateDealStage(parseInt(draggableId, 10), destStage);
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) {
    return (
      <Layout activePage="pipeline">
        <div className="p-6 text-xl">Loading pipeline...</div>
      </Layout>
    );
  }

  return (
    <Layout activePage="pipeline">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Sales Pipeline</h1>
        <p className="text-gray-500 mb-8">
          Drag deals between stages to update their status
        </p>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-4 gap-6">
            {STAGES.map((stage) => (
              <Droppable key={stage.key} droppableId={stage.key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white rounded-xl p-4 shadow-sm border border-gray-200 transition-all ${
                      snapshot.isDraggingOver ? "shadow-md bg-blue-50" : ""
                    }`}
                    style={{ minHeight: "200px" }}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: stage.color }}
                        ></span>
                        <h2 className="font-semibold">{stage.label}</h2>
                      </div>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {columns[stage.key]?.length || 0}
                      </span>
                    </div>

                    {/* Cards */}
                    {columns[stage.key] && columns[stage.key].length > 0 ? (
                      columns[stage.key].map((deal, index) => (
                        <Draggable
                          key={deal.id}
                          draggableId={deal.id.toString()}
                          index={index}
                        >
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              className={`p-4 rounded-lg border bg-white shadow-sm mt-2 cursor-grab transition-all ${
                                dragSnapshot.isDragging
                                  ? "shadow-xl scale-[1.03] opacity-90 border-blue-300"
                                  : "hover:shadow-md"
                              }`}
                              title={`Company: ${deal.company_name || "-"}\nValue: $${deal.amount}\nClose: ${
                                deal.close_date || "-"
                              }`}
                            >
                              <h3 className="font-semibold text-gray-800">
                                {deal.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                ${parseFloat(deal.amount).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {deal.company_name}
                              </p>
                            </div>
                          )}
                        </Draggable>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm mt-2">No deals</p>
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </Layout>
  );
};

export default PipelinePage;
