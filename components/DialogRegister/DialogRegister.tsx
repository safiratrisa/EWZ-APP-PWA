import { useRef, useState } from "react";
import styled from "styled-components";
import { LS_DATA } from "../../constants/config";
import Button from "../Button";

const DialogOverlay = styled("div").withConfig({
  shouldForwardProp: (prop) => !["open"].includes(prop),
})<{ open: boolean }>`
  display: ${(props) => (props.open ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const DialogBox = styled("div")`
  padding: 20px 30px;
  background-color: white;
  text-align: center;
  border-radius: 10px;

  .title {
  }
  .body {
    margin-top: 20px;
  }
  .action {
    margin-top: 20px;
  }
  input {
    border-radius: 10px;
    height: 40px;
    text-align: center;
    border: 1px solid gray;
  }
`;

const DialogRegister: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [userLocation, setUserLocation] = useState('')

  const onClickLocation = async () => {
    navigator.geolocation.getCurrentPosition(function(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const geoApi = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=id`
      fetch(geoApi)
      .then(res=>res.json())
      .then(data => {
        setUserLocation(data.principalSubdivision)
      })
      .catch(()=> setUserLocation('-'))
    }, function(err){
    }, { timeout: 10000 })
  }

  const onClickRegister = async() => {
    if (!inputRef.current?.value) {
      alert("Nama Kosong");
    } else {
      localStorage.setItem(
        LS_DATA,
        JSON.stringify({
          name: `${inputRef.current.value} | ${userLocation}`,
          id: Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1),
        })
      );
      onClose();
    }
  };

  return (
    <DialogOverlay open={open}>
      <DialogBox>
        <div className="title">Daftarkan Nama Anda</div>
        <div className="body">
          <input ref={inputRef} placeholder="Nama" type="text" />
        </div>
        <div className="action">
          <Button onClick={onClickLocation} disable={userLocation!==''}>Get Location</Button>
        </div>
        <div className="action">
          <Button onClick={onClickRegister} disable={userLocation===''}>Daftar</Button>
        </div>
      </DialogBox>
    </DialogOverlay>
  );
};

export default DialogRegister;
