import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { APP_ROUTES } from "../../constants/routes";
import { useEduQuest } from "../../hooks/useEduQuest";
import { COURSE_CONTENT } from "./courseContent";
import { DEFAULT_COURSE_ID } from "./constants";
import {
  buildMissionWithUiList,
  getActiveMission,
  getActiveMissionContent,
  getCompletedMissionsCount,
  getCourseById,
  getCourseIcon,
  getCourseThemeClass,
  getFirstUnlockedMissionId,
  getNextMission,
  getNextUnlockedCourseRoute,
  getProgressPercent,
} from "./helpers";
import type { AnswerState, MissionWithUi } from "./types";
import CourseHeader from "./components/CourseHeader";
import MissionSidebar from "./components/MissionSidebar";
import MissionContent from "./components/MissionContent";
import RewardModal from "./components/RewardModal";
import styles from "./CoursePage.module.css";

const CoursePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { data, completeMission } = useEduQuest();

  const courseId = params.id ?? DEFAULT_COURSE_ID;

  const course = useMemo(() => {
    if (!data) {
      return null;
    }

    return getCourseById(data.courses, courseId);
  }, [data, courseId]);

  const missionContentList = COURSE_CONTENT[courseId] ?? [];

  const missions = useMemo<MissionWithUi[]>(() => {
    if (!course) {
      return [];
    }

    return buildMissionWithUiList(course, missionContentList);
  }, [course, missionContentList]);

  const firstUnlockedId = useMemo(() => {
    return getFirstUnlockedMissionId(missions);
  }, [missions]);

  const [activeMissionId, setActiveMissionId] = useState("");
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [showReward, setShowReward] = useState(false);
  const [rewardXp, setRewardXp] = useState(0);

  const resetAnswerState = () => {
    setSelectedOptionId(null);
    setAnswerState("idle");
  };

  const resetRewardState = () => {
    setShowReward(false);
    setRewardXp(0);
  };

  const resetMissionUiState = () => {
    resetAnswerState();
    resetRewardState();
  };

  useEffect(() => {
    if (!firstUnlockedId) {
      return;
    }

    setActiveMissionId(firstUnlockedId);
    resetMissionUiState();
  }, [firstUnlockedId, courseId]);

  const activeContent = useMemo(() => {
    return getActiveMissionContent(missionContentList, activeMissionId);
  }, [missionContentList, activeMissionId]);

  const activeMission = useMemo(() => {
    return getActiveMission(missions, activeMissionId);
  }, [missions, activeMissionId]);

  const completedCount = useMemo(() => {
    return getCompletedMissionsCount(missions);
  }, [missions]);

  const totalCount = missions.length;
  const progressPercent = getProgressPercent(completedCount, totalCount);

  const openMission = (missionId: string) => {
    const mission = missions.find((item) => item.id === missionId);

    if (!mission || mission.locked) {
      return;
    }

    setActiveMissionId(missionId);
    resetAnswerState();
  };

  const handleSelect = (optionId: string) => {
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
  };

  const checkAnswer = () => {
    if (!selectedOptionId || !activeContent) {
      return;
    }

    const isCorrect = selectedOptionId === activeContent.correctOptionId;
    setAnswerState(isCorrect ? "checked_correct" : "checked_wrong");
  };

  const goNext = () => {
    const nextMission = getNextMission(missions, activeMissionId);

    if (nextMission && !nextMission.locked) {
      setActiveMissionId(nextMission.id);
      resetAnswerState();
      return;
    }

    if (data) {
      const nextCourseRoute = getNextUnlockedCourseRoute(data.courses, courseId);

      if (nextCourseRoute) {
        resetMissionUiState();
        navigate(nextCourseRoute);
        return;
      }
    }

    navigate(APP_ROUTES.courses);
  };

  const finishMission = () => {
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
  };

  if (!data || !course) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  const courseIcon = getCourseIcon(courseId);
  const courseThemeClass = getCourseThemeClass(courseId, styles);

  return (
    <div className={styles.page}>
      <button
        className={styles.back}
        type="button"
        onClick={() => navigate(APP_ROUTES.courses)}
      >
        ← Назад к курсам
      </button>

      <CourseHeader
        course={course}
        courseIcon={courseIcon}
        courseThemeClass={courseThemeClass}
        completedCount={completedCount}
        totalCount={totalCount}
        progressPercent={progressPercent}
      />

      <section className={styles.grid}>
        <MissionSidebar
          missions={missions}
          activeMissionId={activeMissionId}
          onOpenMission={openMission}
        />

        <MissionContent
          courseIcon={courseIcon}
          activeMission={activeMission}
          activeContent={activeContent}
          selectedOptionId={selectedOptionId}
          answerState={answerState}
          onSelect={handleSelect}
          onCheckAnswer={checkAnswer}
          onFinishMission={finishMission}
        />
      </section>

      <RewardModal
        isOpen={showReward}
        rewardXp={rewardXp}
        isFinalMission={Boolean(activeMission?.isFinal)}
        onClose={() => setShowReward(false)}
        onNext={() => {
          setShowReward(false);
          goNext();
        }}
      />
    </div>
  );
};

export default CoursePage;