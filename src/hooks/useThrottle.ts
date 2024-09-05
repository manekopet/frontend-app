import throttle from "lodash/throttle";
import { useCallback, useEffect, useRef } from "react";

export const useThrottle = (cb: any, delay: number) => {
  const options = { leading: true, trailing: false };
  const cbRef = useRef(cb);
  // use mutable ref to make useCallback/throttle not depend on `cb` dep
  useEffect(() => {
    cbRef.current = cb;
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(
    throttle((...args) => cbRef.current(...args), delay, options),
    [delay]
  );
};
