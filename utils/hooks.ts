import { useEffect, useRef, useCallback } from "react";

export const useOnMount = (callback: React.EffectCallback): void => {
  const savedCallback = useRef<React.EffectCallback>();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    const onDismount = savedCallback.current?.();

    return (): void => {
      if (onDismount) onDismount();
    };
  }, []);
};

export const useFirstInputFocus = <T extends HTMLElement>(): [React.MutableRefObject<T | null>, () => void] => {
  const ref = useRef<T>(null);

  const handleFocus = useCallback(() => {
    window.requestAnimationFrame(() => {
      const firstInput = ref.current?.querySelector('input, [href], select, button, textarea') as HTMLElement;

      firstInput?.focus();
    });
  }, []);

  return [ref, handleFocus];
};