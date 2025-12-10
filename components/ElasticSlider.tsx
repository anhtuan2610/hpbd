import React, { useRef, useState } from "react";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";
import { Volume1, Volume2 } from "lucide-react";
import "./ElasticSlider.css";

const MAX_OVERFLOW = 50;

interface ElasticSliderProps {
  defaultValue?: number;
  startingValue?: number;
  maxValue?: number;
  className?: string;
  isStepped?: boolean;
  stepSize?: number;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  /** Callback mỗi khi giá trị thay đổi (0 - maxValue) */
  onChange?: (value: number) => void;
}

const ElasticSlider: React.FC<ElasticSliderProps> = ({
  defaultValue = 50,
  startingValue = 0,
  maxValue = 100,
  className = "",
  isStepped = false,
  stepSize = 1,
  leftIcon = <Volume2 className="text-pink-600" />,
  rightIcon = <Volume1 className="text-pink-600" />,
  onChange,
}) => {
  return (
    <div className={`slider-container ${className}`}>
      <Slider
        defaultValue={defaultValue}
        startingValue={startingValue}
        maxValue={maxValue}
        isStepped={isStepped}
        stepSize={stepSize}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onChange={onChange}
      />
    </div>
  );
};

interface SliderProps {
  defaultValue: number;
  startingValue: number;
  maxValue: number;
  isStepped: boolean;
  stepSize: number;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
  onChange?: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({
  defaultValue,
  startingValue,
  maxValue,
  isStepped,
  stepSize,
  leftIcon,
  rightIcon,
  onChange,
}) => {
  const [value, setValue] = useState<number>(defaultValue);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [region, setRegion] = useState<"top" | "middle" | "bottom">("middle");
  const clientY = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(1);

  useMotionValueEvent(clientY, "change", (latest: number) => {
    if (sliderRef.current) {
      const { top, bottom } = sliderRef.current.getBoundingClientRect();
      let newValue: number;
      if (latest < top) {
        setRegion("top");
        newValue = top - latest;
      } else if (latest > bottom) {
        setRegion("bottom");
        newValue = latest - bottom;
      } else {
        setRegion("middle");
        newValue = 0;
      }
      overflow.jump(decay(newValue, MAX_OVERFLOW));
    }
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons > 0 && sliderRef.current) {
      const { top, height } = sliderRef.current.getBoundingClientRect();
      // Tính từ top xuống bottom (giá trị cao ở trên, thấp ở dưới)
      const relativeY = e.clientY - top;
      const ratio = relativeY / height;
      let newValue = startingValue + (1 - ratio) * (maxValue - startingValue);
      if (isStepped) {
        newValue = Math.round(newValue / stepSize) * stepSize;
      }
      newValue = Math.min(Math.max(newValue, startingValue), maxValue);
      setValue(newValue);
      clientY.jump(e.clientY);
      if (onChange) {
        onChange(newValue);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerMove(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerUp = () => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
  };

  const getRangePercentage = (): number => {
    const totalRange = maxValue - startingValue;
    if (totalRange === 0) return 0;
    return ((value - startingValue) / totalRange) * 100;
  };

  return (
    <>
      <motion.div
        onHoverStart={() => animate(scale, 1.2)}
        onHoverEnd={() => animate(scale, 1)}
        onTouchStart={() => animate(scale, 1.2)}
        onTouchEnd={() => animate(scale, 1)}
        style={{
          scale,
          opacity: useTransform(scale, [1, 1.2], [0.7, 1]),
        }}
        className="slider-wrapper"
      >
        <motion.div
          animate={{
            scale: region === "top" ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{
            y: useTransform(() =>
              region === "top" ? -overflow.get() / scale.get() : 0
            ),
          }}
        >
          {leftIcon}
        </motion.div>

        <div
          ref={sliderRef}
          className="slider-root"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
        >
          <motion.div
            style={{
              scaleY: useTransform(() => {
                if (sliderRef.current) {
                  const { height } = sliderRef.current.getBoundingClientRect();
                  return 1 + overflow.get() / height;
                }
                return 1;
              }),
              scaleX: useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]),
              transformOrigin: useTransform(() => {
                if (sliderRef.current) {
                  const { top, height } =
                    sliderRef.current.getBoundingClientRect();
                  return clientY.get() < top + height / 2 ? "bottom" : "top";
                }
                return "center";
              }),
              width: useTransform(scale, [1, 1.2], [6, 12]),
              marginLeft: useTransform(scale, [1, 1.2], [0, -3]),
              marginRight: useTransform(scale, [1, 1.2], [0, -3]),
            }}
            className="slider-track-wrapper"
          >
            <div className="slider-track">
              <motion.div
                className="slider-range"
                style={{
                  height: `${getRangePercentage()}%`,
                }}
                transition={{ duration: 0 }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{
            scale: region === "bottom" ? [1, 1.4, 1] : 1,
            transition: { duration: 0.25 },
          }}
          style={{
            y: useTransform(() =>
              region === "bottom" ? overflow.get() / scale.get() : 0
            ),
          }}
        >
          {rightIcon}
        </motion.div>
      </motion.div>
      <p className="value-indicator">{Math.round(value)}</p>
    </>
  );
};

function decay(value: number, max: number): number {
  if (max === 0) {
    return 0;
  }
  const entry = value / max;
  const sigmoid = 2 * (1 / (1 + Math.exp(-entry)) - 0.5);
  return sigmoid * max;
}

export default ElasticSlider;
