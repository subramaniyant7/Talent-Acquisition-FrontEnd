"use client";
import { ACCESS_TOKEN } from "@/constants/ENVIRONMENT_VARIABLES";
import {
  CALENDER_EVENT_API,
  CALENDER_MEETING_EVENT_API,
  GET_ACTIVITIES_API,
  GET_CANDIDATE_STATUS_API,
  GET_HIRED_API,
  GET_INTERVIEW_AND_HIRED_DETAILS_API,
  GET_POSTED_JOB_Active_LISTS_API,
  GET_POSTED_JOB_LISTS_API,
  GET_TICKET_LIST_API,
  GET_TODAY_MEETING_DETAILS_API,
  GET_UPCOMINGS_API,
  LOGIN_API,
  LOGOUT_API,
  USER_ACCOUNT_MANAGEMENT_ACCOUNT_API,
} from "@/utils/API";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import Cookies from "js-cookie"; // Import the js-cookie library

// Helper function to handle common async thunk logic
const createAsyncThunkHandler = (apiFunction:any, propName:any, onLoginSuccess?:any) =>
  createAsyncThunk(`dashboard/${propName}`, async (data: any) => {
    try {
      // Call the API function with provided data
      let response;
      if (data) {
        response = await apiFunction(data);
      } else {
        response = await apiFunction();
      }

      // If there's a login success callback, call it with the response
      if (onLoginSuccess && propName === "login") {
        onLoginSuccess(response);
      }

      return response;
    } catch (error) {
      // Handle error
      console.error(`${propName} failed:`, error);
      throw error;
    }
  });

// Define async thunks using the helper function
export const getCandidateStatusList : any = createAsyncThunkHandler(
  GET_CANDIDATE_STATUS_API,
  "candidate_status_list"
);

export const getInterviewAndHiredDetails = createAsyncThunkHandler(
  GET_INTERVIEW_AND_HIRED_DETAILS_API,
  "interview_and_hired_details"
);

export const getPostedJobList = createAsyncThunkHandler(
  GET_POSTED_JOB_LISTS_API,
  "posted_job_list"
);

export const getPostedJobActiveList = createAsyncThunkHandler(
  GET_POSTED_JOB_Active_LISTS_API,
  "posted_job_active_list"
);

export const getTodayMeetingDetailsList = createAsyncThunkHandler(
  GET_TODAY_MEETING_DETAILS_API,
  "today_meeting_details_list"
);

export const getActivities = createAsyncThunkHandler(
  GET_ACTIVITIES_API,
  "activities_list"
);

export const getUpcomings = createAsyncThunkHandler(
  GET_UPCOMINGS_API,
  "upcomings_list"
);

export const getHirings = createAsyncThunkHandler(
  GET_HIRED_API,
  "hirings_list"
);
export const userlogin: any = createAsyncThunkHandler(
  LOGIN_API,
  "login",
  (response:any) => {
    // Assuming response contains session information such as user data, access token, etc.
    const { access_token, user_email, user_id, refresh_token } = response;
    // Store user data and access token in cookies
    Cookies.set(
      ACCESS_TOKEN,
      JSON.stringify({ access_token, user_email, user_id, refresh_token })
    );
  }
);

export const getTicketList = createAsyncThunkHandler(
  GET_TICKET_LIST_API,
  "ticket_List"
);

export const userLogout: any = createAsyncThunkHandler(LOGOUT_API, "logout");

export const userAccountManagementAccount = createAsyncThunkHandler(
  USER_ACCOUNT_MANAGEMENT_ACCOUNT_API,
  "user_account_management"
);


export const getCalendarEvent : any = createAsyncThunkHandler(
  CALENDER_EVENT_API,
  "calendar_events_list"
);

export const getCalendarMeetingEvent : any = createAsyncThunkHandler(
  CALENDER_MEETING_EVENT_API,
  "calendar_meeting_info"
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    candidate_status_list: [],
    interview_and_hired_details: {},
    posted_job_list: [],
    posted_job_active_list: [],
    today_meeting_details_list: [],
    activities_list: [],
    upcomings_list: [],
    hirings_list: [],
    ticket_List: [],
    inventory_Assets: [],
    notification_list: [],
    login: {},
    logout: {},
    user_account_management: {},
    loading: false,
    calendar_events_list: [],
    calendar_meeting_info: {}
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("dashboard/") &&
          action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("dashboard/") &&
          action.type.endsWith("/fulfilled"),
        (state : any, action: any) => {
          state.loading = false;
          const propName = action.type.split("/")[1]; // Extract property name from action type
          state[propName] = action.payload;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("dashboard/") &&
          action.type.endsWith("/rejected"),
        (state) => {
          state.loading = false;
        }
      );
  },
});

export const dashboardSelector = (state: any) => state.dashboard;
export default dashboardSlice.reducer;
