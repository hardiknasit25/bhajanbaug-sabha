export const API_ENDPOINTS = {
  MEMBERS: {
    BASE: "user",
    UPDATE_STATUS: "update-status",

    POSHAK_GROUP: "poshak-group",
  },

  SABHA: {
    BASE: "sabha",
    START_SABHA: "sabha/start",
    CREATE_EVENT: "create-event",
    UPDATE_EVENT: "update-event",
    SUBMIT_SABHA_REPORT: "sabha/complete",
    SYNC: "attendance/sync",
    REASON: "attendance/reason",
  },

  REPORT: {
    BASE: "report",
    MEMBER_REPORT: "report/user",
    GROUP_REPORT: "report/group",
  },

  GROUPS: {
    SELECT: "poshak-group/select",
  },
};
