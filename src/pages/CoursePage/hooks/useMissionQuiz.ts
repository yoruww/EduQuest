import { useCallback, useEffect, useState } from "react";
import { APP_ROUTES } from "../../../constants/routes";
import type { Course } from "../../../types/eduquest";
import type { AnswerState, MissionContent, MissionWithUi } from "../types";
import { getNextMission, getNextUnlockedCourseRoute } from "../helpers";

interface UseMissionQuizParams {
  missions: MissionWithUi[];
  activeMissionId: string;
  setActiveMissionId: (missionId: string) => void;
  activeMission: MissionWithUi | null;
  activeContent: MissionContent | null;
  dataCourses: Course[];
  courseId: string;
  completeMission: (
    courseId: string,
    missionId: string,
    xpEarned: number
  ) => void;
  navigate: (to: string) => void;
}

export const useMissionQuiz = ({
  missions,
  activeMissionId,
  setActiveMissionId,
  activeMission,
  activeContent,
  dataCourses,
  courseId,
  completeMission,
  navigate,
}: UseMissionQuizParams) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [showReward, setShowReward] = useState(false);
  const [rewardXp, setRewardXp] = useState(0);

  const resetAnswerState = useCallback(() => {
    setSelectedOptionId(null);
    setAnswerState("idle");
  }, []);

  const resetRewardState = useCallback(() => {
    setShowReward(false);
    setRewardXp(0);
  }, []);

  const resetMissionUiState = useCallback(() => {
    resetAnswerState();
    resetRewardState();
  }, [resetAnswerState, resetRewardState]);

  const handleSelect = useCallback(
    (optionId: string) => {
      if (!activeMission || activeMission.locked) {
        return;
      }

      if (
        answerState === "checked_correct" ||
        answerState === "checked_wrong"
      ) {
        return;
      }

      setSelectedOptionId(optionId);
      setAnswerState("selected");
    },
    [activeMission, answerState]
  );

  const checkAnswer = useCallback(() => {
    if (!selectedOptionId || !activeContent) {
      return;
    }

    const isCorrect = selectedOptionId === activeContent.correctOptionId;
    setAnswerState(isCorrect ? "checked_correct" : "checked_wrong");
  }, [selectedOptionId, activeContent]);

  const goNext = useCallback(() => {
    const nextMission = getNextMission(missions, activeMissionId);

    if (nextMission && !nextMission.locked) {
      setActiveMissionId(nextMission.id);
      resetAnswerState();
      return;
    }

    const nextCourseRoute = getNextUnlockedCourseRoute(dataCourses, courseId);

    if (nextCourseRoute) {
      resetMissionUiState();
      navigate(nextCourseRoute);
      return;
    }

    navigate(APP_ROUTES.courses);
  }, [
    missions,
    activeMissionId,
    setActiveMissionId,
    resetAnswerState,
    dataCourses,
    courseId,
    resetMissionUiState,
    navigate,
  ]);

  const finishMission = useCallback(() => {
    if (!activeMission) {
      return;
    }

    if (activeMission.completed) {
      return;
    }

    if (
      answerState !== "checked_correct" &&
      answerState !== "checked_wrong"
    ) {
      return;
    }

    const xp = answerState === "checked_correct" ? activeMission.xp : 0;

    completeMission(courseId, activeMission.id, xp);
    setRewardXp(xp);
    setShowReward(true);
  }, [activeMission, answerState, completeMission, courseId]);

  useEffect(() => {
    if (!showReward) {
      setRewardXp(0);
    }
  }, [showReward]);

  return {
    selectedOptionId,
    answerState,
    showReward,
    rewardXp,
    setShowReward,
    resetAnswerState,
    resetMissionUiState,
    handleSelect,
    checkAnswer,
    finishMission,
    goNext,
  };
};