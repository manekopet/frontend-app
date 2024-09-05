import useFaucet from "@/hooks/useFaucet";
import { Button } from "@mui/material";
import { FaucetWrapper } from "./Faucet.styled";

export default function Faucet() {
  const { loading, onFaucet } = useFaucet();
  return (
    <FaucetWrapper>
      <Button disabled={loading} onClick={onFaucet}>
        {loading ? "Loading ..." : "Faucet"}
      </Button>
    </FaucetWrapper>
  );
}
