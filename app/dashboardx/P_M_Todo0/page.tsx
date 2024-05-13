"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import Link from "next/link";
import moment from "moment";
import { useSelector } from "react-redux";
import {
  Calendar,
  momentLocalizer,
  dateFnsLocalizer,
  Views,
} from "react-big-calendar";
import { Button, Modal } from "@mui/material";

import SideMenu from "@/app/dashboard/component/SideMenu";

import "react-big-calendar/lib/css/react-big-calendar.css"; // Import the calendar styles
import "./style.css";

import {
  getCalendarEvent,
  dashboardSelector,
  getCalendarMeetingEvent,
} from "@/store/reducers/dashboard";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

console.log("localizer", localizer);

export default function P_M_Todo0() {
  const dispatch = useDispatch();

  const myEventsList = [
    {
      title: "Event 1",
      start: new Date(),
      end: new Date(new Date().setHours(new Date().getHours() + 1)),
    },
  ];
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [activeEventModal, setActiveEventModal] = useState();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [events, setEvents] = useState(myEventsList);

  // Calendar State and Redux
  const [calendarEvent, setCalendarEvent] = useState([]);
  const [calendarEventModal, setCalendatEventModal] = useState(false);
  const { calendar_events_list, calendar_meeting_info } =
    useSelector(dashboardSelector);

  // Define months and years
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = [
    { value: "2022", label: "2022" },
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    // Add more years as needed
  ];

  // Handle month and year changes
  const handleMonthChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedYear(e.target.value);
  };

  const handleSelectSlot = (event: any) => {
    if (typeof event.start === "string") {
      event.start = new Date(event.start);
    }

    if (typeof event.end === "string") {
      event.end = new Date(event.end);
    }

    setActiveEventModal(event);
  };

  const handleSelectEvent = useCallback((event: any) => {
    const { id } = event;
    console.log(event);
    dispatch(getCalendarMeetingEvent(`id=${id}`));
  }, []);

  const handleSelect = (event: any, e) => {
    const { start, end } = event;
    setActiveEventModal(event);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const EventDetailModal = () => {
    return (
      <>
        {activeEventModal?.title && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              backgroundColor: "white",
              border: "1px solid black",
              padding: "10px",
              color: "blue",
              height: "100%",
              zIndex: 1000,
            }}
          >
            {activeEventModal?.title}
          </div>
        )}
      </>
    );
  };

  // Custom Event Component
  const CustomEvent = ({ event }: any) => {
    return (
      <>
        <div className="calendarTopSection">
          <ul>
            <li className="text-[12px] py-1">Python Developer</li>
            <li className="text-[12px] py-1">Interviewer: Geetha</li>
            <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
            <li className="text-[12px] py-1">Via : Google Voice</li>
          </ul>
        </div>
        {/* <div className="shadow bg-white" style={{ position: "relative" }}>
          <strong className="text-black">{event.title}</strong>
          <p>{event.start.toLocaleString()}</p>
        </div>
        {activeEventModal && <EventDetailModal />} */}
      </>
    );
  };

  // Calendar Event Actions
  let today = moment().toDate();
  let startOfWeek = moment().startOf("week").toDate();
  let endOfWeek = moment().endOf("week").toDate();

  const ColoredDateCellWrapper = ({ children }: any) =>
    React.cloneElement(React.Children.only(children), {
      style: {
        backgroundColor: "lightblue",
      },
    });

  const { components, defaultDate, views, scrollToTime } = useMemo(
    () => ({
      components: {
        timeSlotWrapper: ColoredDateCellWrapper,
      },
      defaultDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      views: Object.keys(Views).map((k) => Views[k]),
      scrollToTime: new Date(1970, 1, 1, 6),
    }),
    []
  );

  const handleCalendarEventModal = () => {
    setCalendatEventModal(!calendarEventModal);
  };

  useEffect(() => {
    if (calendar_meeting_info && Object.keys(calendar_meeting_info).length) {
      console.log("calendar_meeting_info", calendar_meeting_info);
      setCalendatEventModal(true);
    }
  }, [calendar_meeting_info]);

  useEffect(() => {
    if (calendar_events_list && calendar_events_list.length) {
      const eventsList = calendar_events_list.map((event: any) => {
        return {
          ...event,
          title: event.desc,
          start: new Date(event.start),
          end: new Date(event.end),
        };
      });
      setCalendarEvent(eventsList);
    }
  }, [calendar_events_list]);

  useEffect(() => {
    dispatch(
      getCalendarEvent(
        `from_date=${startOfWeek.getFullYear()}-${
          startOfWeek.getMonth() + 1
        }-${startOfWeek.getDate()}&to_date=${endOfWeek.getFullYear()}-${
          endOfWeek.getMonth() + 1
        }-${endOfWeek.getDate()}`
      )
    );
  }, []);

  return (
    <section className="">
      <div className="container-fluid my-md-5 my-4">
        <div className="row">
          <div className="col-lg-1 leftMenuWidth ps-0 position-relative">
            <SideMenu />
          </div>

          <div className="col-lg-11 pe-lg-4 ps-lg-0">
            <div className="row justify-content-between align-items-center">
              <div className="col-lg-8 projectText">
                <h1>Calendar</h1>
                <p className="mt-3">
                  Enjoy your selecting potential candidates Tracking and
                  Management System.
                </p>
              </div>

              <div className="col-lg-4 mt-3 mt-lg-0 text-center text-lg-end">
                <Link
                  prefetch
                  href="/P_M_JobDescriptions1"
                  className="btn btn-light me-3 mx-lg-2"
                >
                  JD Assets
                </Link>
                <Link
                  prefetch
                  href="P_M_JobDescriptions4"
                  className="btn btn-blue bg-[#0a66c2!important]"
                >
                  Create New JD
                </Link>
              </div>
            </div>

            <div className="TotalEmployees shadow bg-white rounded-3 p-3 w-100 mt-4">
              <div className="md:flex align-items-center">
                <h3 className="projectManHeading">Your Todo’s</h3>
                <div className="ml-auto d-flex todoHeadingSelect">
                  <div className="month-year-picker">
                    <select value={selectedMonth} onChange={handleMonthChange}>
                      <option value="">Select Month</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                    <select value={selectedYear} onChange={handleYearChange}>
                      <option value="">Select Year</option>
                      {years.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div
                className="d-none d-lg-block "
                style={{ width: "100%", position: "relative" }}
              >
                {/* <div className="calendarTopSection top-[250px] left-[100px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div>

                <div className="calendarTopSection top-[450px] left-[200px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div>

                <div className="calendarTopSection top-[450px] left-[800px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div>


                <div className="calendarTopSection top-[280px] left-[400px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div>

                <div className="calendarTopSection top-[280px] left-[700px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div>

                <div className="calendarTopSection top-[320px] left-[1000px]">
                  <ul>
                    <li className="text-[12px] py-1">Python Developer</li>
                    <li className="text-[12px] py-1">Interviewer: Geetha</li>
                    <li className="text-[12px] py-1">Time : 10 - 11 A.M</li>
                    <li className="text-[12px] py-1">Via : Google Voice</li>
                  </ul>
                </div> */}
                {/* <Calendar
                  className="TodoDataTable"
                  selectable
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  style={{ height: 600 }}
                  defaultView={"week"}
                  timeslots={4} // number of per section
                  step={15}
                  views={{ month: true, week: true, day: true }} // Show only month, week, and day views
                  components={{ event: CustomEvent }}
                  // components={components}
                  formats={{
                    dayFormat: "EEEE", // day labels
                  }}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelect}
                /> */}
              </div>

              {calendarEventModal && (
                <Modal
                  open={calendarEventModal}
                  onClose={handleCalendarEventModal}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <>
                    <div className="col-lg-7 col-12 modalHeader">
                      <div className="d-flex justify-between align-items-center px-3 pb-2 pt-3">
                        <h5 className="" id="simple-modal-title">
                          Calendar Event
                        </h5>
                        <Button
                          onClick={handleCalendarEventModal}
                          className="btn-blue py-[5px!important] px-0 w-[20px!important]"
                          variant="contained"
                        >
                          <i className="fa fa-close" aria-hidden="true"></i>
                        </Button>
                      </div>
                      <hr className="mt-0" />
                      <div
                        className="lg:flex px-3"
                        style={{ flexDirection: "column", gap: "40px" }}
                      >
                        <p> Title : {calendar_meeting_info.desc} </p>

                        <p> Start : {calendar_meeting_info.start} </p>
                        {calendar_meeting_info.comment !== null ? (
                          <p> Comment : {calendar_meeting_info.comment} </p>
                        ) : null}
                        {calendar_meeting_info.summary !== null ? (
                          <p> Summary : {calendar_meeting_info.summary} </p>
                        ) : null}
                        <p>
                          <Link
                            prefetch
                            href={calendar_meeting_info.link}
                            className="btn btn-light me-3 mx-lg-2"
                            target="_blank"
                            style={{ color: "green" }}
                          >
                            Join
                          </Link>
                        </p>
                      </div>
                    </div>
                  </>
                </Modal>
              )}

              <Calendar
                defaultDate={defaultDate}
                defaultView={Views.WEEK}
                events={calendarEvent}
                localizer={localizer}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                selectable
                scrollToTime={scrollToTime}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// const CustomEvent = (event:any) => {
//   console.log(event,"sadfsdfsd")
//   return (
//     <span> <strong> {event.title} </strong> </span>
//   )
// }
// Custom Toolbar Component
const CustomToolbar = ({ label }: any) => {
  return (
    <div className="custom-toolbar ">
      <strong>{label}</strong>
      {/* Add custom buttons or components here */}
    </div>
  );
};
