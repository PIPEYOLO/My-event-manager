
export default function DefaultSwitch ({ isOn, switchState }) {

  return (
    <div 
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer ${
        isOn ? "bg-6" : 'bg-gray-300'
      }`}
      onClick={ switchState }
    >
      <div
        className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
          isOn ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </div>
  );
};
