import * as gameApi from "@/apis/game";
import { MainContent } from "@/components/presentation/MainContent";
import useAnalyticsEventTracker from "@/utils/useAnalyticsEventTracker";
import * as amplitude from "@amplitude/analytics-browser";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Grid,
  styled,
  Toolbar,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FlexGrow from "../../components/presentation/FlexGrow";
import "./History.css";

interface ActivityItem {
  text: string;
  time: string;
}

const Activityy = styled(Box)(() => ({
  display: "flex",
  background: "#fff",
  borderRadius: "10px",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  padding: "12px",
  height: "52px",
}));

const ActivityText = styled(Box)(() => ({
  width: "60%",
  fontSize: "12px",
  fontWeight: 500,
  lineHeight: "15px",
  letterSpacing: "0.07px",
  marginRight: "12px",
}));

const ActivityTime = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: 300,
  lineHeight: "15px",
  letterSpacing: "0.07px",
}));

const ALL_ACTIVITY = 2;
const MY_ACTIVITY = 1;

const Page: React.FC = () => {
  const [limit, setLimit] = useState<number>(15);
  const [offset, setOffset] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [activities, setActivity] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [filterText, setFiterText] = useState("All Activities");
  const [filterValue, setFiterValue] = useState(2);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const gaEventTracker = useAnalyticsEventTracker("History");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = () => {
    if (filterText === "All Activities") {
      setFiterText("My Activities");
      getActivity(MY_ACTIVITY, 15, 0, true);
    } else {
      setFiterText("All Activities");
      getActivity(ALL_ACTIVITY, 15, 0, true);
    }
  };
  const handleFilter = (type: any) => {
    setHasMoreItems(true);
    setOffset(0);
    if (type == "all") {
      setFiterText("My Activities");
      setFiterValue(2);
      getActivity(ALL_ACTIVITY, 15, 0, true);
    } else {
      setFiterText("My Activities");
      setFiterValue(1);
      getActivity(MY_ACTIVITY, 15, 0, true);
    }
    setAnchorEl(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const loader = (
    <div
      className="loading-process"
      style={{ marginTop: "20px", width: "100%", textAlign: "center" }}
    >
      <CircularProgress className="" />
    </div>
  );

  const getActivity = async (
    type: any,
    limitApi: any,
    offsetApi: any,
    isFilter?: any
  ) => {
    try {
      setFetching(true);
      const { data, total } = await gameApi.activityGetList(
        type,
        limitApi,
        offsetApi
      );
      if (isFilter) {
        setActivity([]);
      }
      setActivity(data);
      setFetching(false);
      setTotal(total);
    } catch (e: any) {}
  };

  useEffect(() => {
    gaEventTracker("view_history", "view_history");
    amplitude.track("view_history");
    getActivity(filterValue, limit, offset);
  }, []);

  const fetchMoreData = async (filterValue: any) => {
    setFetching(true);
    if (hasMoreItems === false) {
      return;
    }
    try {
      const { data } = await gameApi.activityGetList(
        filterValue,
        limit,
        offset
      );
      setActivity([...activities, ...data]);
      setOffset(offset + limit);
      if (data.length < limit) {
        setHasMoreItems(false);
      }
      setFetching(false);
    } catch (e: any) {
      setHasMoreItems(false);
      setFetching(false);
    }
  };

  const convertTime = (time: any) => {
    const timeAgo = moment(time).fromNow();
    return timeAgo;
  };
  return (
    <MainContent>
      <AppBar position="relative">
        <Toolbar disableGutters>
          History
          <FlexGrow />
          <Button
            className="btn-filter"
            onClick={handleClick}
            sx={{ borderRadius: "50px" }}
          >
            {filterText}
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container className="grid-activities">
        {activities.length === 0 && (
          <Activityy style={{ width: "100%", justifyContent: "center" }}>
            <div className="no-data-content">
              <p>No assets</p>
            </div>
          </Activityy>
        )}
        <InfiniteScroll
          dataLength={activities.length}
          next={() => fetchMoreData(filterValue)}
          hasMore={hasMoreItems}
          loader={fetching ? loader : ""}
          // loader={loader}
          scrollableTarget="scrollableDiv"
          scrollThreshold={0.5}
        >
          <Grid container spacing={2} sx={{ mb: "20px" }}>
            {activities.map((a) => (
              <Grid item xs={12}>
                <Activityy>
                  <ActivityText>{a?.message}</ActivityText>
                  <ActivityTime>{convertTime(a?.created_at)}</ActivityTime>
                </Activityy>
              </Grid>
            ))}
          </Grid>
        </InfiniteScroll>
      </Grid>
    </MainContent>
  );
};

export default Page;
