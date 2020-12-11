import { Box, Button, Container, IconButton, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ManualPurchaseForm } from "./ManualPurchaseForm";
import { Purchase } from "../models/Purchase";
import { PurchaseSelector } from "./PurchaseSelector";
import './PurchaseCreator.scss'
import { ArrowBackIcon, CloseIcon } from "@chakra-ui/icons";
import { ConfirmPurchaseDialogContents } from "./ConfirmPurchaseDialogContents";


// const useStyles = makeStyles({
//   loader: {
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   subDialog: {
//     height: "300px",
//     width: "300px",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

interface PurchaseCreatorProps {
  onPurchaseCreated: (purchase: Purchase) => void;
  open: boolean,
  onClose: () => void;
  purchases: Purchase[];
}

export const PurchaseCreator: React.FC<PurchaseCreatorProps> = ({
  // @ts-ignore
  onPurchaseCreated,
  open,
  onClose,
  purchases,
}) => {

 
  const [subDialogConfig, setSubDialogConfig] = useState({
    dialogOpen: false,
    contents: null as null | JSX.Element
  });


  useEffect(() => {
    if (open) {
      setSubDialogConfig({
        contents: null,
        dialogOpen: false,
      });
    }
  }, [open]);

  const closeAll = () => {
    setSubDialogConfig({
      contents: null,
      dialogOpen: false
    })
    onClose();
  }

  const requestConfirmPurchase = (amount: string, description: string) => {
    if (amount && description) {
      const contents = <ConfirmPurchaseDialogContents amount={amount} description={description} confirmPurchase={confirmPurchase} onClose={() => setSubDialogConfig({...subDialogConfig, contents: null })} />;
      setSubDialogConfig({
        dialogOpen: true,
        contents,
      });
    }
  };

  const confirmPurchase = async (amount: string, description: string) => {
    const loading = <LoadingContents />;
    setSubDialogConfig({
      dialogOpen: true,
      contents: loading,
    });
    try {
      const created = <LoadedContents onClose={closeAll} />;
      await doCreatePurchase(amount, description);
      setTimeout(() => {
        setSubDialogConfig({
          dialogOpen: true,
          contents: created,
        });
      }, 500);
    } catch (err) {
      const created = <>faild</>;
      setSubDialogConfig({
        dialogOpen: true,
        contents: created,
      });
    }
  };

  const doCreatePurchase = async (amount: string, description: string) => {
    if (amount && description) {
      const res = await axios.post("/api/purchases", { amount, description });
      onPurchaseCreated(res.data);
    } else {
      throw new Error("Amount or description missing");
    }
  };

  return (
    <Box height='100%'>
      <Box className='top-bar' onClick={onClose}>
        <CloseIcon />
        <Text>
          BACK
        </Text>
      </Box>
      {subDialogConfig.contents && subDialogConfig.dialogOpen && 
        <Box
          className='sub-dialog'
          open={subDialogConfig.dialogOpen}
          onClose={() =>
            setSubDialogConfig({ ...subDialogConfig, dialogOpen: false })
          }
        >
          <Box>{subDialogConfig.contents}</Box>
        </Box> 
      }

        <Container className='form-container'>
          <ManualPurchaseForm  open={open} requestConfirmPurchase={requestConfirmPurchase} />
        </Container>
       <Container bg="lighterDark" className='purchaseSelectorList'>
          <PurchaseSelector requestConfirmPurchase={requestConfirmPurchase} purchases={purchases} />
       </Container>
    </Box>
  );
};


const LoadingContents = () => {
  return (
    <Box className='loadingDialog'>
        <Box>Luodaan...</Box>
        <Spinner size="xl" />

    </Box>
  )
}

const LoadedContents = ({ onClose }: { onClose: () => void }) => (
  <Box className='loadingDialog'>
    <Box>Luotu</Box>
    <Button onClick={onClose} colorScheme='teal'>OK</Button>
  </Box>
)