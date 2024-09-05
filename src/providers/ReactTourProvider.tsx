import { useSelector } from "@/hooks/redux";
import useOnboardingStep from "@/hooks/useOnboardingStep";
import { ActionButton } from "@/pages/Guides/Guide.styled";
import { onboardingSelectors } from "@/redux/features/onboarding/selectors";
import { StepType, TourProvider } from "@reactour/tour";
import { ReactNode } from "react";

const BoxMark = ({ stepName, des }: { stepName: string; des: string }) => {
  const { setNextStep, setPreviousStep, currentStep } = useOnboardingStep();
  return (
    <div style={{ padding: 0 }}>
      <p className="title-mark">
        {" "}
        <ActionButton
          sx={{ width: "30px" }}
          style={{ marginRight: 15, background: "#F7E8F6", minWidth: 70 }}
        >
          {currentStep > 6 ? 6 : currentStep}/6
        </ActionButton>
        {stepName}
      </p>
      <span className="body-mark">{des}</span>
      <div style={{ marginTop: 20 }}>
        <ActionButton
          onClick={() => setNextStep()}
          color="primary"
          style={{ marginRight: 5 }}
        >
          Next
        </ActionButton>
        <ActionButton onClick={() => setPreviousStep()} color="primary">
          Back
        </ActionButton>
      </div>
    </div>
  );
};

const BoxMarkStart = () => {
  // const navigate = useNavigate();
  const { setNextStep, setFinishStep } = useOnboardingStep();
  return (
    <div style={{ padding: 0 }}>
      <p className="title-mark">Your ManekoPet Awaits! </p>
      <span className="body-mark">
        Ready to learn the secrets of caring for your new companion? Let's get
        started!
      </span>
      <div style={{ marginTop: 20 }}>
        <ActionButton
          onClick={() => setNextStep()}
          color="primary"
          style={{ marginRight: 5 }}
        >
          Next
        </ActionButton>
        <ActionButton color="primary" onClick={setFinishStep}>
          skip for now
        </ActionButton>
      </div>
    </div>
  );
};

const steps: StepType[] = [
  {
    selector: ".step-start",
    content: <BoxMarkStart />,
    position: [window.innerWidth / 2 - 350 / 2, window.innerHeight - 280],
  },
  {
    selector: ".step-01",
    content: (
      <BoxMark
        stepName="Feed pet"
        des="Feed your pet regularly by selecting food icons. Each type of food resets your pet's 'Starve Timer'."
      />
    ),
  },
  {
    selector: ".step-02",
    content: (
      <BoxMark
        stepName="Starve timer"
        des="Displays the remaining time until your pet starves. When it reaches zero, your pet may faint or die."
      />
    ),
  },
  {
    selector: ".step-03",
    highlightedSelectors: [".step-04", ".step-03"],
    content: (
      <BoxMark
        stepName="Clean Poo"
        des="When you see poo next to your pet, use the brush icon to clean it and maintain good health."
      />
    ),
    position: [0, 0],
  },
  // {
  //   selector: ".step-04",
  //   content: (
  //     <BoxMark
  //       stepName="Clean Poo"
  //       des="When you see poo next to your pet, use the brush icon to clean it and maintain good health."
  //     />
  //   ),
  // },
  {
    selector: ".step-05",
    content: (
      <BoxMark
        stepName="Play with Maneko"
        des="Your pet often gets bored. Play arcade games at least once a day to keep it entertained and happy."
      />
    ),
  },
  {
    selector: ".step-06",
    content: (
      <BoxMark
        stepName="Shop for items"
        des="Personalize your pet with accessories from the shop, such as a shield for protection against attacks."
      />
    ),
  },
  {
    selector: ".step-07",
    content: (
      <BoxMark
        stepName="Attack players"
        des="Hit or kill players for rewards. Win points for attacking and earn stars for kills."
      />
    ),
  },
  {
    selector: ".step-08",
    content: (
      <BoxMark
        stepName="Attack players"
        des="Hit or kill players for rewards. Win points for attacking and earn stars for kills."
      />
    ),
  },
];

function ReactTourProvider({ children }: { children: ReactNode }) {
  const currentStep = useSelector(onboardingSelectors.selectCurrentStep);
  console.log("currentStep", currentStep);
  return (
    <TourProvider
      showBadge={false}
      showDots={false}
      showCloseButton={false}
      steps={steps}
      currentStep={currentStep}
      showNavigation={false}
    >
      {children}
    </TourProvider>
  );
}

export default ReactTourProvider;
