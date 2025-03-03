"use client";

import { useState, useTransition } from "react";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Edit2, GripVertical, Plus, Save, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TopicsType } from "@/lib/types/topics";

import { H3 } from "../../typography/h3";

interface SubmodulesType {
  id: string;
  name: string;
  weightage: "easy" | "medium" | "hard";
  subtopics: {
    id: string;
    title: string;
  }[];
  numericals: {
    id: string;
    title: string;
  }[];
  formulas: boolean;
  examples: boolean;
  completed: boolean;
  tryCount: number;
}

type TopicEditorProps = {
  credits: number;
  setCredits: (credits: number) => void;
  topics: TopicsType;
  setSteps: (steps: number) => void;
  setGeneratingMaterialId: (materialId: string) => void;
};

export function TopicEditor({
  credits,
  setCredits,
  topics,
  setSteps,
  setGeneratingMaterialId,
}: TopicEditorProps) {
  if (!topics.submodules) {
    return (
      <H3 className="flex h-[40dvh] items-center justify-center px-5 text-center text-red-500">
        Please reload the page and fill in the form again - some error occurred
        on our half.
      </H3>
    );
  }

  const [topicsArr, setTopicsArr] = useState<SubmodulesType[]>(() => {
    return topics.submodules.map((submodule, idx) => ({
      id: `topic-${idx}-${crypto.randomUUID()}`,
      name: submodule.name,
      weightage: submodule.weightage,
      subtopics: submodule.subtopics.map((title, i) => ({
        id: `subtopic-${idx}-${i}-${crypto.randomUUID()}`,
        title,
      })),
      numericals: submodule.numericals.map((title, i) => ({
        id: `numerical-${idx}-${i}-${crypto.randomUUID()}`,
        title,
      })),
      formulas: submodule.formulas,
      examples: submodule.examples,
      completed: submodule.completed,
      tryCount: submodule.tryCount,
    }));
  });
  const [editingTopic, setEditingTopic] = useState<string | null>(null);
  const [editingSubtopic, setEditingSubtopic] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const addSubtopic = (topicId: string) => {
    setTopicsArr(
      topicsArr.map((topic) => {
        if (topic.id === topicId) {
          return {
            ...topic,
            subtopics: [
              ...topic.subtopics,
              {
                id: `subtopic-new-${crypto.randomUUID()}`,
                title: "New Subtopic",
              },
            ],
          };
        }
        return topic;
      })
    );
  };

  const updateTopicTitle = (topicId: string, newName: string) => {
    setTopicsArr(
      topicsArr.map((topic) =>
        topic.id === topicId ? { ...topic, name: newName } : topic
      )
    );
  };

  const updateSubtopicTitle = (
    topicId: string,
    subtopicId: string,
    newTitle: string
  ) => {
    setTopicsArr(
      topicsArr.map((topic) => {
        if (topic.id === topicId) {
          return {
            ...topic,
            subtopics: topic.subtopics.map((subtopic) =>
              subtopic.id === subtopicId
                ? { ...subtopic, title: newTitle }
                : subtopic
            ),
          };
        }
        return topic;
      })
    );
  };

  const removeTopic = (topicId: string) => {
    setTopicsArr(topicsArr.filter((topic) => topic.id !== topicId));
  };

  const removeSubtopic = (topicId: string, subtopicId: string) => {
    setTopicsArr(
      topicsArr.map((topic) => {
        if (topic.id === topicId) {
          return {
            ...topic,
            subtopics: topic.subtopics.filter(
              (subtopic) => subtopic.id !== subtopicId
            ),
          };
        }
        return topic;
      })
    );
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (result.type === "topic") {
      const newTopics = Array.from(topicsArr);
      const [reorderedItem] = newTopics.splice(sourceIndex, 1);
      newTopics.splice(destIndex, 0, reorderedItem);
      setTopicsArr(newTopics);
    } else if (result.type === "subtopic") {
      const sourceTopicId = result.source.droppableId;
      const destTopicId = result.destination.droppableId;

      const sourceTopicIndex = topicsArr.findIndex(
        (t) => t.id === sourceTopicId
      );
      const destTopicIndex = topicsArr.findIndex((t) => t.id === destTopicId);

      const newTopics = Array.from(topicsArr);
      const sourceSubtopics = Array.from(newTopics[sourceTopicIndex].subtopics);
      const [reorderedItem] = sourceSubtopics.splice(sourceIndex, 1);

      if (sourceTopicId === destTopicId) {
        sourceSubtopics.splice(destIndex, 0, reorderedItem);
        newTopics[sourceTopicIndex].subtopics = sourceSubtopics;
      } else {
        const destSubtopics = Array.from(newTopics[destTopicIndex].subtopics);
        destSubtopics.splice(destIndex, 0, reorderedItem);
        newTopics[sourceTopicIndex].subtopics = sourceSubtopics;
        newTopics[destTopicIndex].subtopics = destSubtopics;
      }

      setTopicsArr(newTopics);
    }
  };

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        setError("");
        const res = await fetch("/api/generation/enqueue-generation", {
          method: "POST",
          body: JSON.stringify({
            topics: topicsArr,
            instruction: topics.instruction,
            moduleName: topics.moduleName,
            type: topics.type,
            complexity: topics.complexity,
            subject: topics.subject,
            course: topics.course,
            exam: topics.exam,
            language: topics.language,
            credits,
          }),
          headers: { "Content-Type": "application/json" },
        });
        const response = await res.json();
        if (response?.error) {
          setError(response.error);
          setCredits(response.credits);
          return;
        }
        setGeneratingMaterialId(response.materialId);
        setSteps(3);
      } catch (err) {
        console.error(err);
        setError("Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form className="mx-auto my-10 max-w-[870px]" action={handleSubmit}>
      <Card className="bg-brand-bg text-card-foreground">
        <CardHeader>
          <CardTitle className="text-center text-base text-brand-heading md:text-lg">
            Topics and Subtopics
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-[80dvh] w-full overflow-scroll">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="topics" type="topic">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {topicsArr.map((topic, topicIndex) => (
                    <Draggable
                      key={topic.id}
                      draggableId={topic.id}
                      index={topicIndex}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="rounded-lg border border-border bg-background p-2"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-move"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            {editingTopic === topic.id ? (
                              <div className="flex flex-1 items-center gap-2">
                                <Input
                                  value={topic.name}
                                  onChange={(e) =>
                                    updateTopicTitle(topic.id, e.target.value)
                                  }
                                  className="bg-input"
                                />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingTopic(null)}
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <h3 className="line-clamp-1 text-center text-lg font-medium sm:line-clamp-2">
                                {topic.name}
                              </h3>
                            )}
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  editingTopic === topic.id
                                    ? setEditingTopic(null)
                                    : setEditingTopic(topic.id)
                                }
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => removeTopic(topic.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <Droppable droppableId={topic.id} type="subtopic">
                            {(provided) => (
                              <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="ml-2 space-y-2"
                              >
                                {topic.subtopics.map(
                                  (subtopic, subtopicIndex) => (
                                    <Draggable
                                      key={subtopic.id}
                                      draggableId={subtopic.id}
                                      index={subtopicIndex}
                                    >
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className="flex items-center justify-between"
                                        >
                                          <div
                                            {...provided.dragHandleProps}
                                            className="mr-2 cursor-move"
                                          >
                                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                                          </div>
                                          {editingSubtopic === subtopic.id ? (
                                            <div className="flex flex-1 items-center gap-2">
                                              <Input
                                                value={subtopic.title}
                                                onChange={(e) =>
                                                  updateSubtopicTitle(
                                                    topic.id,
                                                    subtopic.id,
                                                    e.target.value
                                                  )
                                                }
                                                className="bg-input"
                                              />
                                              <Button
                                                type="button"
                                                size="sm"
                                                variant="ghost"
                                                onClick={() =>
                                                  setEditingSubtopic(null)
                                                }
                                              >
                                                <Save className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          ) : (
                                            <span>{subtopic.title}</span>
                                          )}
                                          <div className="flex items-center gap-2">
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="ghost"
                                              onClick={() =>
                                                editingSubtopic === subtopic.id
                                                  ? setEditingSubtopic(null)
                                                  : setEditingSubtopic(
                                                      subtopic.id
                                                    )
                                              }
                                            >
                                              <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              type="button"
                                              size="sm"
                                              variant="ghost"
                                              onClick={() =>
                                                removeSubtopic(
                                                  topic.id,
                                                  subtopic.id
                                                )
                                              }
                                              className="text-destructive hover:text-destructive"
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                          {topic.subtopics.length < 3 && (
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => addSubtopic(topic.id)}
                              className="mt-2 text-primary"
                              disabled={!topic.id.startsWith("topic-new")}
                            >
                              <Plus className="mr-2 h-4 w-4" /> Add Subtopic
                            </Button>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {credits && (
        <div className="my-5 text-center text-brand-green">
          Approx Credits Required: {credits}.
        </div>
      )}

      {error && <div className="my-5 text-center text-red-500">{error}</div>}

      {!isPending ? (
        <Button
          type="submit"
          variant={"glowy"}
          className="my-5 w-full bg-brand-yellow text-primary-foreground hover:bg-brand-yellow/90"
        >
          Generate Study Material
        </Button>
      ) : (
        <Button
          type="submit"
          variant={"glowy"}
          className="my-5 w-full bg-brand-yellow text-primary-foreground hover:bg-brand-yellow/90"
          disabled
        >
          Generating Study Material...
        </Button>
      )}
    </form>
  );
}
