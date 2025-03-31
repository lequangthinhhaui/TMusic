function TopBar() {
    return (
      <div className="flex justify-between items-center pl-2 pr-2 pb-2 ">
        <h1 className="text-4xl font-bold">
          <img src="./logo.png" alt="Logo" className="w-20" /> {/* Custom logo */}
        </h1>
        {/* <input
          type="text"
          placeholder="Search..."
          className="bg-gray-700 p-2 rounded w-1/3"
        /> */}
      </div>
    );
  }
  
  export default TopBar;
  