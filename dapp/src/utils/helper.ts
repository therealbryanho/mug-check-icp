import axios from "axios"

export const loadBalance = (user:any, setUser:any, setLoadingBalance:any) => {
    if (user.principal_id) {
      setLoadingBalance(true)
      axios.get(`${import.meta.env.VITE_ICP_SERVER_URL}/getPrincipalBalance/${user.principal_id}`)
        .then((res: any) => {

          //setBalance(res.data.tokenbalance)
          let tokenBalanceStr = res.data.tokenbalance.toString();

          // Extract the last 8 digits for the fractional part
          let fractionalPart = tokenBalanceStr.slice(-8);

          // Extract the integer part by removing the last 8 digits
          let integerPart = tokenBalanceStr.slice(0, -8);

          // Combine the integer and fractional parts
          let combinedValue = parseInt(integerPart, 10) + parseInt(fractionalPart, 10) / 100000000;


          // Set the balance
          if (isNaN(combinedValue)) {
            // setBalance(0);
            setUser((prev:any) => ({...prev, balance: 0}))
          } else {
            // setBalance(combinedValue);
            setUser((prev:any) => ({...prev, balance: combinedValue}))
          }

          setLoadingBalance(false)
        })
        .catch((err:any) => {
          console.log(err);
          setLoadingBalance(false)
          if (err.response.data.error) {
            alert(err.response.data.error)
            return
          }
          alert("Could not get your balance at the moment")
        })
    }
  }