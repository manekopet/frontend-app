import * as gameApi from "@/apis/game";
import * as nftPetApi from "@/apis/nft-pet";
import { ReactComponent as DefenseIcon } from "@/assets/svg/shield.svg";
import { MainContent } from "@/components/presentation/MainContent";
import { useDispatch, useSelector } from "@/hooks/redux";
import useAudios from "@/hooks/useAudios";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import appSlice from "@/redux/features/app/slice";
import { petSelectors } from "@/redux/features/pet/selectors";
import petSlice from "@/redux/features/pet/slice";
import { getErrorMessage } from "@/types/error";
import { Pet, PetWithState } from "@/types/pet";
import useAnalyticsEventTracker from "@/utils/useAnalyticsEventTracker";
import * as amplitude from "@amplitude/analytics-browser";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import {
  AppBar,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Grid,
  Pagination,
  PaginationRenderItemParams,
  Toolbar,
  styled,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import HeaderWallet from "../../components/HeaderWallet";
import FlexGrow from "../../components/presentation/FlexGrow";

const LeaderboardInfo = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: "300",
  lineHeight: "15px",
  letterSpacing: "0.07px",
  textAlign: "left",
  marginBottom: "10px",
}));

const LeaderboardBox = styled(Box)(() => ({
  display: "flex",
  background: "#fff",
  borderRadius: "10px",
  justifyContent: "center",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  padding: "12px",
}));

const LeaderboardRank = styled(Box)(() => ({
  marginRight: "12px",
}));

const LeaderboardProfile = styled(Box)(() => ({
  flexGrow: "1",
}));
const LeaderboardProfileName = styled(Box)(() => ({
  fontSize: "14px",
  fontWeight: "500",
  lineHeight: "18px",
  letterSpacing: "0.07px",
  textAlign: "left",
  marginBottom: "4px",
}));
const LeaderboardProfilePoints = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: "300",
  lineHeight: "15px",
  letterSpacing: "0.07px",
  textAlign: "left",
}));

const ActionButton = styled(Button)(() => ({
  minWidth: "90px",
  height: "38px",
  margin: 0,
  textAlign: "center",
  background: "rgba(0, 0, 0, 0.15)",
  borderRadius: "50px",
}));

const ActionButtonHit = styled(Button)(() => ({
  minWidth: "90px",
  height: "38px",
  margin: 0,
  textAlign: "center",
  background: "#D3FBFE",
  borderRadius: "50px",

  ".MuiButton-startIcon": {
    margin: 0,
  },
}));

const ActionButtonKill = styled(Button)(() => ({
  minWidth: "90px",
  height: "38px",
  margin: 0,
  textAlign: "center",
  background: "#F4FFF1",
  borderRadius: "50px",
}));

const StyledPagination = styled(Pagination)(() => ({
  "& ul": {
    justifyContent: "space-between",
  },
}));

interface PagingButtonProps extends ButtonProps {
  selected?: boolean;
}

const PagingButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "selected",
})<PagingButtonProps>(({ selected }) => ({
  minWidth: "35px",
  height: "35px",
  padding: 0,
  background: selected ? "#FED3E7" : "#fff",

  "&:hover": {
    background: selected ? "#FED3E7" : "#fff",
    boxShadow: "1px 1px 0px 0px #0D1615",
  },
  "&:active": {
    background: selected ? "#FED3E7" : "#fff",
    boxShadow: "1px 1px 0px 0px #0D1615",
  },
}));

const Page: React.FC = () => {
  const [limit, setLimit] = useState<number>(8);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [leaderboards, setLeaderboards] = useState<Pet[]>([]);
  const [fetching, setFetching] = useState(false);
  const pets = useSelector(petSelectors.selectPets);
  const [firstLoading, setFirstLoading] = useState(pets.length > 0);
  const activePet = useSelector<PetWithState | null>(
    petSelectors.selectActivePet
  );
  const [isAttacking, setIsAttacking] = useState<boolean>(false);
  const { attackAudio } = useAudios();
  const { height: windowHeight } = useWindowDimensions();
  const dispatch = useDispatch();

  const gaEventTracker = useAnalyticsEventTracker("Leaderboard");

  const fetchActivePet = async (nftId: string) => {
    // Get pet active
    const pet: PetWithState = await nftPetApi.getMyPetFeed(nftId);
    dispatch(petSlice.actions.activePet({ pet }));
  };

  const fetchPets = async () => {
    try {
      // Get list my pet
      const pets: Pet[] = await nftPetApi.getMyPets();
      if (pets.length > 0) {
        dispatch(petSlice.actions.setPets({ pets }));

        // Get pet active
        fetchActivePet(activePet ? activePet.pet?.nftId : pets[0].nftId);
      }
    } catch (e: any) {
      console.log("Not found NFTs.");
    } finally {
    }
  };

  useEffect(() => {
    const getLeaderboards = async () => {
      setFetching(true);
      try {
        const { data, total } = await gameApi.leaderboardGetList(
          (page - 1) * limit,
          limit
        );
        setLeaderboards(data);
        setTotal(total);
        setFetching(false);
      } catch (e: any) {
        setFetching(false);
      }
    };

    getLeaderboards();
  }, [limit, page]);

  useEffect(() => {
    if (total > 0) {
      const header = document.getElementById("leaderboard-header");
      const info = document.getElementById("leaderboard-info");
      const leaderboards = document.getElementsByClassName("leaderboard");
      if (leaderboards.length > 0) {
        const leaderboardHeight = leaderboards[0].clientHeight;
        const leaderboardHeaderHeight = header?.clientHeight || 0;
        const leaderboardInfoHeight = info?.clientHeight || 0;

        const windowSizeLimit = Math.floor(
          (windowHeight -
            leaderboardHeaderHeight -
            leaderboardInfoHeight -
            35 -
            90 -
            55) /
            leaderboardHeight
        );
        if (limit !== windowSizeLimit) {
          setLimit(windowSizeLimit);
        }
      }
    }
  }, [windowHeight, total]);

  useEffect(() => {
    gaEventTracker("view_leaderboard", "view_leaderboard");
    amplitude.track("view_leaderboard");
  }, []);

  useEffect(() => {
    if (!firstLoading || pets.length === 0) {
      fetchPets();
    }
  }, [firstLoading]);

  const renderPaginationItem = ({
    type,
    page,
    selected,
    onClick,
  }: PaginationRenderItemParams) => {
    if (type === "next") {
      return (
        <PagingButton onClick={onClick} selected={selected}>
          <ArrowRightIcon />
        </PagingButton>
      );
    } else if (type === "previous") {
      return (
        <PagingButton onClick={onClick} selected={selected}>
          <ArrowLeftIcon />
        </PagingButton>
      );
    } else if (type === "start-ellipsis" || type === "end-ellipsis") {
      return <PagingButton>...</PagingButton>;
    }
    return (
      <PagingButton onClick={onClick} selected={selected}>
        {page}
      </PagingButton>
    );
  };

  const handlePaginationChange = (
    evt: React.ChangeEvent<unknown>,
    page: number
  ) => {
    evt.preventDefault();
    if (page <= total && page > 0) {
      setPage(page);
    }
  };

  const getRankBackground = (rank: number): string => {
    if (rank === 1) {
      return "#FEFAD3";
    }
    if (rank === 2) {
      return "#D3FEE7";
    }
    if (rank === 3) {
      return "#D3E4FE";
    }
    return "#F7F1E9";
  };

  const handleHit = (item: Pet) => {
    return async () => {
      if (activePet) {
        if (isAttacking) {
          return;
        }
        amplitude.track("user-attack-started");
        toast(`Attack underway`);
        setIsAttacking(true);
        try {
          const { message, rewards, points, isWin } = await gameApi.hit(
            "tjWzLMrKqgN9gx45rdyUhXKqG9Ls6mYbGp2hLP63Xv2",
            activePet.pet?.nftId,
            item.nftId
          );
          attackAudio.current.play();
          if (message !== "") {
            toast(message);
          }
          if (rewards !== "") {
            toast(rewards);
          }
          let rewardPoints = points;
          if (isWin === 2) {
            rewardPoints = -Math.abs(rewardPoints);
          }
          if (rewardPoints > 0) {
            dispatch(
              appSlice.actions.showRewardModal({
                points: points,
                symbol: "PTS",
              })
            );
          }
          setTimeout(() => {
            attackAudio.current.pause();
          }, 2000);
          amplitude.track("user-attack-success");
        } catch (e: any) {
          const message = getErrorMessage(e);
          amplitude.track("user-attack-fail");
          toast(message || "Hit failed");
        } finally {
          setIsAttacking(false);
        }
      }
    };
  };

  const handleBlock = (item: Pet) => {
    return async () => {
      console.log("block", activePet, item);
      if (activePet) {
        toast(
          `Player ${
            item.name || `#${item.nftId}`
          } shielded - attack not possible`
        );
      }
    };
  };

  const handleDeath = (item: Pet) => {
    return async () => {
      console.log("death", activePet, item);
      if (activePet) {
        toast(`${item.nftId} was death`);
      }
    };
  };

  const renderActionButton = (item: Pet) => {
    const statusLive = item.statusLive;

    if (activePet && activePet.pet?.nftId === item.nftId) {
      // return <ActionButton disabled>Owner</ActionButton>;
      return null;
    }

    if (
      (activePet && activePet.pet?.petScore > item.petScore) ||
      statusLive === 4
    ) {
      return "";
    }

    if (statusLive === 0 || statusLive === 3) {
      return (
        <ActionButtonHit
          onClick={handleHit(item)}
          startIcon={
            <img src="assets/images2/hit-bonk.png" alt="ghost" width="44px" />
          }
        ></ActionButtonHit>
      );
    }

    if (statusLive === 1) {
      return (
        <ActionButton onClick={handleBlock(item)}>
          <DefenseIcon style={{ width: 14 }} />
        </ActionButton>
      );
    }

    if (statusLive === 2) {
      return (
        <ActionButtonKill
          onClick={handleHit(item)}
          startIcon={
            <img src="assets/images2/ghost.svg" alt="ghost" width="16px" />
          }
        >
          KILL
        </ActionButtonKill>
      );
    }

    return "";
  };

  return (
    <MainContent>
      <AppBar position="relative" id="leaderboard-header">
        <Toolbar disableGutters>
          Leaderboard
          <FlexGrow />
          <HeaderWallet />
        </Toolbar>
      </AppBar>
      <LeaderboardInfo id="leaderboard-info">
        Attack players with higher points than you every 5 minutes and earn
        1&#37; of their rewards. Pet can only be attacked once per hour.
      </LeaderboardInfo>
      <Grid container spacing={2} sx={{ mb: "20px" }}>
        {fetching && (
          <div
            className="loading-process"
            style={{ marginTop: "20px", width: "100%", textAlign: "center" }}
          >
            <CircularProgress className="" />
          </div>
        )}
        {leaderboards.map((l, idx) => {
          const rank = idx + 1 + limit * (page - 1);

          return (
            <Grid key={`l-${l.id}-${idx}`} item xs={12} className="leaderboard">
              <LeaderboardBox>
                <LeaderboardRank>
                  <Button
                    size="small"
                    sx={{ background: getRankBackground(rank) }}
                  >
                    #{idx + 1 + limit * (page - 1)}
                  </Button>
                </LeaderboardRank>
                <LeaderboardProfile>
                  <LeaderboardProfileName>
                    {l.name ? `${l.name} #${l.nftId}` : l.nftId}
                  </LeaderboardProfileName>
                  <LeaderboardProfilePoints>
                    {l.petScore.toFixed(2)} pts
                  </LeaderboardProfilePoints>
                </LeaderboardProfile>
                <Box>{renderActionButton(l)}</Box>
              </LeaderboardBox>
            </Grid>
          );
        })}
      </Grid>
      {total > limit && (
        <StyledPagination
          count={Math.ceil(total / limit)}
          page={page}
          onChange={handlePaginationChange}
          renderItem={renderPaginationItem}
          variant="outlined"
          shape="rounded"
        />
      )}
    </MainContent>
  );
};

export default Page;
