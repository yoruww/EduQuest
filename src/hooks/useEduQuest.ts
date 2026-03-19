import { useEduQuestContext } from "../context/EduQuestProvider";

export const useEduQuest = () => {
  return useEduQuestContext();
};