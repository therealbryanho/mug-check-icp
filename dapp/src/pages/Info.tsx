import Logo from "@/components/ui/logo"
import { UserContext } from "@/context/UserProvider"
import { loadBalance } from "@/utils/helper";
import { useContext, useEffect, useState } from "react"
import { CgSpinner } from "react-icons/cg";

const Info = () => {
    const { user, setUser } = useContext(UserContext);
    const [loadingBalance, setLoadingBalance] = useState(false);

    const cafes = [
        {
            img: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png",
            name: "Starbucks",
            address: "Sesame Street 21, Blk 26, Level 18",
            offer: "$1 off for every 20 tokens",
        },
        {
            img: "https://seeklogo.com/images/T/the-coffee-bean-logo-9882650D03-seeklogo.com.png",
            name: "Coffee Bean",
            address: "Sesame Street 21, Blk 26, Level 18",
            offer: "$1 off for every 20 tokens",
        },
        {
            img: "https://cdn.worldvectorlogo.com/logos/luckin-coffee.svg",
            name: "luckin cofee",
            address: "Sesame Street 21, Blk 26, Level 18",
            offer: "$1 off for every 20 tokens",
        },
    ];

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

                    <p className="text-center text-sm font-medium my-5">Use your reward tokens at these cafes.</p>

                    <section className="px-2 mt-3">
                        <div>
                            {cafes.map((cafe, i) => (
                                <div key={i} className="flex gap-3 mb-10">
                                    <img
                                        src={cafe.img}
                                        alt={cafe.name}
                                        className="w-20 h-20 object-cover"
                                    />

                                    <div className="">
                                        <h3 className="font-medium">{cafe.name}</h3>
                                        <div className="mt-1">
                                            <p className="text-sm">{cafe.address}</p>
                                            <p className="text-sm">{cafe.offer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </section>
    )
}
export default Info