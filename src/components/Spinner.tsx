import { useState, CSSProperties } from "react";
import { ClipLoader } from "react-spinners";

// const override = {
//   display: "block",
//   margin: "0 auto",
//   borderColor: "red",
// };
// interface colorType{
//     colorType:"#fff" | '#000'
// } 

// let colorType: = "#fff" | '#000';
// interface colorType{
//     color: #fff | 
// }

function Spinner({color}:{color:"#fff" | "000"}) {



  return (
    
      <ClipLoader 
        color={color}
        
        // cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    
  );
}

export default Spinner;