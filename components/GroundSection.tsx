"use client";

export default function GroundSection() {
  return (
    <>
      {/* Ground image ở dưới cùng màn hình */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none"
        style={{
          height: "200px",
          backgroundImage: "url('/ground.png')",
          backgroundRepeat: "repeat-x",
          backgroundPosition: "bottom",
          backgroundSize: "auto 200px",
          imageRendering: "pixelated",
        }}
      />

      {/* Border để xác định chiều cao của ground - có thể điều chỉnh height */}
      <div
        className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none border-4 border-blue-500 border-dashed"
        style={{
          height: "40px", // Điều chỉnh giá trị này để xác định chiều cao của ground
        }}
      />
    </>
  );
}
