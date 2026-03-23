export type ContributionType = "question" | "experience";
export type ContributionStatus = "pending" | "approved" | "rejected";
export type PrepQuestionCategory = "aptitude" | "coding" | "interview";

export type QuestionContributionData = {
  category: PrepQuestionCategory;
  tags: string[];
  question: string;
  answer: string;
};

export type ExperienceContributionData = {
  title: string;
  experience: string;
  rating: number;
};

export type Contribution = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  type: ContributionType;
  company: string;
  round: string;
  title: string;
  content: string;
  questionData?: QuestionContributionData;
  experienceData?: ExperienceContributionData;
  status: ContributionStatus;
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  pointsAwarded?: number;
};

const CONTRIBUTIONS_KEY = "hirelytics:contributions";
const REWARD_POINTS_KEY = "hirelytics:reward-points";

type RewardPointsMap = Record<string, number>;

const isBrowser = typeof window !== "undefined";

const readJson = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("hirelytics:contributions-updated"));
};

const normalizeContribution = (
  item: Contribution & {
    questionData?: QuestionContributionData & { tag?: string };
    experienceData?: ExperienceContributionData & { rating?: number };
  }
) => {
  const experienceData = item.experienceData
    ? {
        ...item.experienceData,
        rating:
          typeof item.experienceData.rating === "number" && item.experienceData.rating >= 1 && item.experienceData.rating <= 5
            ? item.experienceData.rating
            : 5,
      }
    : undefined;

  if (!item.questionData) {
    return {
      ...item,
      experienceData,
    };
  }

  const legacyTag = item.questionData.tag;
  const tags = Array.isArray(item.questionData.tags)
    ? item.questionData.tags
    : legacyTag
    ? [legacyTag]
    : [];

  return {
    ...item,
    experienceData,
    questionData: {
      ...item.questionData,
      tags,
    },
  };
};

export const getContributions = () =>
  readJson<Contribution[]>(CONTRIBUTIONS_KEY, []).map((item) =>
    normalizeContribution(item as Contribution & { questionData?: QuestionContributionData & { tag?: string } })
  );

export const saveContribution = (contribution: Contribution) => {
  const current = getContributions();
  writeJson(CONTRIBUTIONS_KEY, [contribution, ...current]);
};

export const updateContributionStatus = (
  contributionId: string,
  status: Exclude<ContributionStatus, "pending">,
  pointsToAward = 0
) => {
  const current = getContributions();
  const updated = current.map((item) => {
    if (item.id !== contributionId || item.status !== "pending") return item;

    return {
      ...item,
      status,
      approvedAt: status === "approved" ? new Date().toISOString() : item.approvedAt,
      rejectedAt: status === "rejected" ? new Date().toISOString() : item.rejectedAt,
      pointsAwarded: status === "approved" ? pointsToAward : 0,
    };
  });

  writeJson(CONTRIBUTIONS_KEY, updated);

  const approved = updated.find((item) => item.id === contributionId);
  if (approved && approved.status === "approved" && pointsToAward > 0) {
    const points = getRewardPoints();
    writeJson(REWARD_POINTS_KEY, {
      ...points,
      [approved.userId]: (points[approved.userId] ?? 0) + pointsToAward,
    });
  }

  return updated;
};

export const getRewardPoints = () => readJson<RewardPointsMap>(REWARD_POINTS_KEY, {});

export const getUserRewardPoints = (userId?: string | null) => {
  if (!userId) return 0;
  return getRewardPoints()[userId] ?? 0;
};
