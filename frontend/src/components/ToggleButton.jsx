import { useState } from 'react';

export default function SlidingToggleButton({isToggled, setIsToggled}) {

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div
      onClick={handleToggle}
      className={`w-11 h-6 flex items-center rounded-full cursor-pointer ${
        isToggled ? 'bg-blue-500' : 'bg-gray-300'
      } p-1 transition duration-300 ease-in-out`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isToggled ? 'translate-x-5' : 'translate-x-0'
        }`}
      ></div>
    </div>
  );
}
