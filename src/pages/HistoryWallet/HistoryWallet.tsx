import FlexGrow from "@/components/presentation/FlexGrow";
import { isMainnet } from "@/configs/Configs.env";
import useGetHistorySpending from "@/hooks/useGetHistoryPending";
import { balanceDisplayer } from "@/utils/convert";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import { Box, Grid, IconButton, Toolbar, styled } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate } from "react-router-dom";

const Content = styled(Box)`
  padding: 15px 20px;

  .right-box {
    .type {
      font-family: "Geologica";
      font-style: normal;
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 0.0703846px;

      color: #0d1615;
    }
    .time {
      margin-top: 4px;
      font-family: "Geologica";
      font-style: normal;
      font-weight: 300;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 0.0703846px;
      color: #ababab;
    }
  }

  .left-box {
    .token {
      display: flex;
      align-items: center;
      justify-content: end;
      gap: 4px;
      .logo {
      }
      span {
        font-family: "Geologica";
        font-style: normal;
        font-weight: 500;
        font-size: 12px;
        line-height: 15px;
        display: flex;
        align-items: center;

        color: #000000;
      }
    }
    .status {
      margin-top: 4px;
      font-family: "Geologica";
      font-style: normal;
      font-weight: 300;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 0.0703846px;
      text-align: end;
      &.success {
        color: #34c759;
      }
      &.failed {
        color: #d24040;
      }
    }
  }
`;
const Item = styled(Box)(() => ({
  display: "flex",
  background: "#fff",
  borderRadius: "10px",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid rgba(13, 22, 21, 1)",
  boxShadow: "1px 1px 0px 0px rgba(13, 22, 21, 1)",
  padding: "12px",
}));
const ItemTime = styled(Box)(() => ({
  fontSize: "12px",
  fontWeight: 300,
  lineHeight: "15px",
  letterSpacing: "0.07px",
}));

export default function HistoryWallet() {
  const navigate = useNavigate();
  const { history } = useGetHistorySpending();
  const transactions = [
    {
      hash: "2fAeqPB78QpboKnbyLzHboyQSiSv6Peni77RHDLu7hXQag5u1ZZtXGiNeB9CEjMX8sX6VojMZKy1DzZgZdEqMrJ9",
      type: "Deposit",
      amount: 20,
      symbol: "MGEM",
      timestamp: 1716223314172,
      success: true,
    },
    {
      hash: "41ETBPKNA6P41D76fSFJfXrUrTGvgbt4X9XiM7Zciz4KLvXmwiPryZw9fDmF3LTTyvitr1bQT96kuPK5p6X8wPoY",
      type: "Withdraw",
      amount: 20,
      symbol: "MGEM",
      timestamp: 1716223480662,
      success: true,
    },
    {
      hash: "4ujSDFKL7WRBdBmLqN48FqhJvz5R8vTsFrouJpJ7ZmqL1CZWsyRk8PPJcYeh559v968i9QxeQm1jMegAgiK4SfMC",
      type: "Deposit",
      amount: 12323.123,
      symbol: "MGEM",
      timestamp: 1716223524185,
      success: false,
    },
  ];

  function timeAgo(createdAt: string): string {
    const timestamp = new Date(createdAt).getTime();
    const now = new Date();
    const secondsPast = Math.floor((now.getTime() - timestamp) / 1000);

    if (secondsPast < 60) {
      return `${secondsPast} second${secondsPast !== 1 ? "s" : ""} ago`;
    } else if (secondsPast < 3600) {
      const minutesPast = Math.floor(secondsPast / 60);
      return `${minutesPast} minute${minutesPast !== 1 ? "s" : ""} ago`;
    } else if (secondsPast < 86400) {
      const hoursPast = Math.floor(secondsPast / 3600);
      return `${hoursPast} hour${hoursPast !== 1 ? "s" : ""} ago`;
    } else {
      const daysPast = Math.floor(secondsPast / 86400);
      return `${daysPast} day${daysPast !== 1 ? "s" : ""} ago`;
    }
  }

  const statusResponse = (status: number) => {
    switch (status) {
      case 0:
      case 1:
        return "processing";
      case 2:
        return "success";
      default:
        return "failed";
    }
  };

  const itemTypeResponse = (type: number) => {
    switch (type) {
      case 5:
        return "withdraw";
      case 2:
        return "deposit";
      default:
        return "---";
    }
  };

  return (
    <Content>
      <Toolbar disableGutters>
        <IconButton
          size="small"
          edge="start"
          color="inherit"
          onClick={() => navigate(-1)}
          sx={{ mr: 2, background: "#fff" }}
        >
          <ArrowLeftIcon fontSize="small" />
        </IconButton>
        <span style={{ fontWeight: 600 }}>History</span>
        <FlexGrow />
      </Toolbar>

      <InfiniteScroll
        dataLength={6}
        next={() => {}}
        hasMore={false}
        loader={<>loader</>}
        // loader={loader}
        scrollableTarget="scrollableDiv"
        scrollThreshold={0.5}
      >
        <Grid container spacing={2} sx={{ mb: "20px" }}>
          {history.map(
            ({ status, createdAt, id, balance, txhash, itemType }) => (
              <Grid item xs={12} key={id}>
                <Item
                  onClick={() => {
                    window.open(
                      `https://solscan.io/tx/${txhash}${
                        isMainnet ? "" : "?cluster=devnet"
                      }`
                    );
                  }}
                >
                  <div className="right-box">
                    <div className="type">{itemTypeResponse(itemType)}</div>
                    <div className="time">{timeAgo(createdAt)}</div>
                    {/* <ItemText>|</ItemText>
                  <ItemText>{`${amount} ${symbol}`}</ItemText> */}
                  </div>
                  <div className="left-box">
                    <div className="token">
                      <img
                        style={{ width: 16 }}
                        src="/assets/images/gem-token.gif"
                        alt="loading..."
                      />
                      <span>{balanceDisplayer(balance / 1e9)}</span>
                    </div>
                    <div className={"status " + statusResponse(status)}>
                      {statusResponse(status)}
                    </div>
                  </div>
                  {/* <ItemTime>
                  
                </ItemTime> */}
                </Item>
              </Grid>
            )
          )}
        </Grid>
      </InfiniteScroll>
    </Content>
  );
}
