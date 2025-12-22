import { useNavigate } from "react-router";
import { AUTH_TOKEN } from "~/constant/constant";
import { deleteCookie } from "~/utils/cookie";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogOut = () => {
    deleteCookie(AUTH_TOKEN);
    navigate("/login");
  };

  return (
    <div className="h-full w-full flex flex-col justify-start items-center">
      <div className="w-full flex flex-col justify-start items-center gap-4 border-b border-borderColor py-5">
        <img
          src="/images/avatar-placeholder.png"
          alt=""
          className="rounded-full size-36 border-[4px] border-blue-400"
        />
        <div className="flex flex-col justify-center items-center gap-1">
          <span className="uppercase text-lg text-textColor font-medium font-poppins">
            harikrushnabhai vaghasiya
          </span>
          <span className=" text-textLightColor">SMK Id: 24514</span>
        </div>
      </div>

      <div className="w-full flex flex-col justify-start items-start gap-4 p-8">
        <span className="text-textColor text-xl font-light uppercase">
          profile
        </span>
        <span
          className="text-textColor text-xl font-light uppercase"
          onClick={handleLogOut}
        >
          Log out
        </span>
      </div>
    </div>
  );
}

export default Sidebar;
