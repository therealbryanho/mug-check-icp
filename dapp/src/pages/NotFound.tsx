import Logo from "@/components/ui/logo"
import { UserContext } from "@/context/UserProvider";
import { loadBalance } from "@/utils/helper";
import { ArrowLeft } from "lucide-react"
import { useContext, useEffect, useState } from "react";
import { CgSpinner } from "react-icons/cg";
import { useNavigate } from "react-router-dom"

const NotFound = () => {
  const { user, setUser } = useContext(UserContext);
  const [loadingBalance, setLoadingBalance] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    loadBalance(user, setUser, setLoadingBalance);
  }, [user.principal_id])

  return (
    <section className="">
      <div className="background-container min-h-screen">
        <div className="maingame flex flex-col my-10 pt-4 pb-14 px-2">
          <div className="flex justify-between items-center my-4 px-4">
            <Logo />
            <div className="bg-primary text-background px-4 py-2 rounded-sm flex items-center justify-center font-bold">
              {user.principal_id
                ? loadingBalance
                  ? <CgSpinner className="animate-spin" />
                  : user.balance
                : 0
              }
            </div>
          </div>

          <div className="w-full h-full flex flex-col justify-center items-center gap-3 my-10">
            <p className="text-lg font-medium">Page Not Found</p>
            <button onClick={() => navigate(-1)} className="flex gap-2 items-center underline"><ArrowLeft className="w-4 h-4" />go back</button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NotFound