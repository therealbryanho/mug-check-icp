import { useContext, useEffect, useState } from "react"
import PlugWalletConnectButton from "@/components/PlugWalletConnectButton"
import { UserContext } from "@/context/UserProvider"
import axios from "axios"
import ReactGA from "react-ga4";
import Logo from "@/components/ui/logo"
import { CgSpinner } from "react-icons/cg"
import { loadBalance } from "@/utils/helper";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PiSealCheckFill } from "react-icons/pi";

const Home = () => {
  const { user, setUser } = useContext(UserContext)
  const [loadingBalance, setLoadingBalance] = useState(true)
  const [refreshBalance, setRefreshBalance] = useState(false);

  useEffect(() => {
    const ga_measurement_id = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (ga_measurement_id) {
      ReactGA.initialize(ga_measurement_id);
    }
  }, [])

  useEffect(() => {
    loadBalance(user, setUser, setLoadingBalance)
  }, [user.principal_id, refreshBalance])

  useEffect(() => {
    setTimeout(() => {
      const loadingElement = document.getElementById('loading')
      const bodyElement = document.querySelector('body')
      if (loadingElement && bodyElement) {
        loadingElement.style.display = 'none'
        bodyElement.style.overflow = 'auto'
      }
    }, 600)
  }, [])

  const [imageUploadError, setImageUploadError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  useEffect(() => {
    if (imageUploaded) {
      const time_ms = parseInt(import.meta.env.VITE_SUCCESS_MESSAGE_TIME_MS) || 2000;
      setTimeout(() => {
        setImageUploaded(false)
      }, time_ms)
    }
  }, [imageUploaded])
  const fileAdded = (e: any) => {
    e.preventDefault();
    setImageUploadError("");
    const fileInput = e.target; // Store a reference to the file input
    const file = fileInput.files[0];
    if (file) {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("principal_id", user.principal_id);
      formData.append("file", file);

      axios.post(`${import.meta.env.VITE_ICP_SERVER_URL}/verifyImageAndRewardToken`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res: any) => {
          if (res.data.verified) {
            setImageUploaded(true);
            setRefreshBalance(prev => !prev);
          } else {
            setImageUploadError("Sorry, that was not a valid image.")
          }
          setUploadingImage(false)
          fileInput.value = "";
        })
        .catch((err: any) => {
          console.log(err);
          setUploadingImage(false);
          if (err.response?.data?.error) {
            setImageUploadError(err.response.data.error);
          } else {
            setImageUploadError("Could not verify your image at the moment");
          }
          fileInput.value = "";
        })
    }

  }

  return (
    <section className="">
      <div id="loading">
        <div id="preloader">
          <svg viewBox="0 0 100 100">
            <defs>
              <filter id="shadow">
                <feDropShadow dx="0" dy="0" stdDeviation="1.5" flood-color="#C0C0C0" />
              </filter>
            </defs>
            <circle id="loading-spinner"
              style={{ fill: 'transparent', stroke: '#000000', strokeWidth: '7px', strokeLinecap: 'round', filter: 'url(#shadow)' }} cx="50"
              cy="50" r="45" />
          </svg>
        </div>
      </div>

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

          <p className="text-center text-sm font-medium my-5">Join the Reusable Revolution, Get Rewarded.</p>

          <section className="flex flex-col justify-center items-center">
            <div className="relative">
              <img src="coffeecup.jpeg" alt="coffeemug" className="w-full" />
              {user.principal_id
                &&
                <>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/png, image/jpeg, image/gif, image/webp"
                    className="border absolute w-[90%] h-[90%] top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] opacity-0"
                    onChange={fileAdded}
                    disabled={uploadingImage || imageUploaded}
                  />
                  <button
                    className={`bg-secondary font-medium text-center border ${imageUploaded ? "border-green-500" : "border-primary"} shadow-xl shadow-primary/40 px-3 py-2 rounded-md absolute bottom-[30%] hover:bottom-[31%] left-[50%] -translate-x-[50%] -translate-y-[50%] transition-all`}
                    onClick={() => document.getElementById("file-input")?.click()}
                    disabled={uploadingImage || imageUploaded}
                  >
                    {uploadingImage
                      ? "Verifying your image..."
                      : imageUploaded
                        ?
                        <div className="flex flex-col items-center gap-1">
                          <PiSealCheckFill className="w-6 h-6 fill-green-500" />
                          <p>Token Awarded</p>
                        </div>
                        : "Upload Image"
                    }
                  </button>
                </>
              }
            </div>

            {imageUploadError
              &&
              <div className="flex justify-between items-center gap-2 px-2 mb-3">
                <p className="text-sm text-destructive">{imageUploadError}</p>
                <Button
                  className="px-1 py-1 h-fit bg-transparent hover:bg-transparent border border-primary"
                  onClick={() => setImageUploadError("")}
                >
                  <X className="w-4 h-4 text-primary" />
                </Button>
              </div>
            }

            <PlugWalletConnectButton />

            <h3 className="mt-10 text-xl font-semibold">Connect and Upload</h3>
            <p className="text-center my-2 px-2 text-sm font-medium">Image should visibly show your reusable mug with coffee in it. AI will check your image and issue you reward token if verified.</p>
            <a href="/info" className="bg-primary text-primary-foreground px-5 py-2 rounded-sm mt-4">Where to use tokens?</a>
          </section>
        </div>
      </div>
    </section>
  )
}

export default Home
