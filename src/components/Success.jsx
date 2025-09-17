import React, { useEffect, useState } from "react";

export default function Success({message}) {
    const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000); // Spinner will disappear after 3 seconds.

    return () => clearTimeout(timer); // Clean up timer on component unmount.
  }, []);

  if (!visible) return null; 
  return (
      <div className="absolute w-[375px] h-[600px] top-[-20px] left-[-5px] bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="flex items-center gap-2 px-4 py-2 font-medium leading-none text-2sm  shadow-default rounded-md text-[#212058] bg-[#fafbff]">
          {message}
        </div>
      </div>
  );
}

