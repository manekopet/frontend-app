import { onboardingSelectors } from "@/redux/features/onboarding/selectors";
import { onboardingActions } from "@/redux/features/onboarding/slice";
import { useTour } from "@reactour/tour";
import { useDispatch, useSelector } from "./redux";

const MAX_STEP = 7;

export default function useOnboardingStep() {
  const dispatch = useDispatch();
  const { setIsOpen } = useTour();
  const currentStep = useSelector(onboardingSelectors.selectCurrentStep);
  const setStep = (step: number) => {
    dispatch(
      onboardingActions.setStep({
        step,
      })
    );
  };
  const setNextStep = () => {
    if (currentStep === MAX_STEP) {
      setFinishStep();
      return;
    }
    dispatch(
      onboardingActions.setStep({
        step: currentStep + 1,
      })
    );
  };
  const setPreviousStep = () => {
    if (currentStep === 0) return;
    dispatch(
      onboardingActions.setStep({
        step: currentStep - 1,
      })
    );
  };

  const setFinishStep = () => {
    dispatch(onboardingActions.setFinished());
    setIsOpen(false);
  };
  return { setStep, setNextStep, setPreviousStep, currentStep, setFinishStep };
}
