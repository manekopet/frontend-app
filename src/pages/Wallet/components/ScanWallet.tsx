import styled from "@emotion/styled";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef } from "react";

const WrapScan = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function ScanWallet({ address }: { address: string }) {
  const ref = useRef<any>(null);

  useEffect(() => {
    const qrCode = new QRCodeStyling({
      width: 300,
      height: 300,
      image: "/manekopet.png",
      dotsOptions: {
        color: "#5e5e5e",
        type: "rounded",
      },
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 20,
      },
      data: address,
    });
    qrCode.append(ref.current);
  }, []);
  return <WrapScan ref={ref} />;
}
