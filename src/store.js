import { create } from 'zustand';

const useStore = create((set) => {
  return (
    {      
      currentUser:null,
      setCurrentUser:(state)=> set((prev)=>{
        return(
          {
            ...prev,
            currentUser:state
          }
        )
      })
    }
  )
});


export default useStore;