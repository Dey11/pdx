export const AI_SETUP_EVENT = "pdx:open-ai-setup";

export const openAiSetup = (): void => {
  window.dispatchEvent(new Event(AI_SETUP_EVENT));
};
