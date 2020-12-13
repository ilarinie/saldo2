import { Box, Container } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { ManualPurchaseForm } from "./ManualPurchaseForm";
import { PurchaseSelector } from "./PurchaseSelector";
import './PurchaseCreator.scss'
import { ConfirmPurchaseDialogContents } from "./ConfirmPurchaseDialogContents";
import { observer } from "mobx-react-lite";
import { TopBar } from "./TopBar";
import { useHistory } from "react-router-dom";
import { LoadingScreen } from "../../components";
import { RootContext } from "../../state/RootContext";

const PurchaseCreator: React.FC = observer(() => {

  const { purchases, createPurchase } = useContext(RootContext);
  const history = useHistory();

  const [modalConfig, setSubDialogConfig] = useState({
    dialogOpen: false,
    contents: null as null | JSX.Element
  });

  const requestConfirmPurchase = (amount: number, description: string) => {
    if (amount && description) {
      const contents = <ConfirmPurchaseDialogContents amount={amount} description={description} confirmPurchase={confirmPurchase} onClose={() => setSubDialogConfig({...modalConfig, contents: null })} />;
      setSubDialogConfig({
        dialogOpen: true,
        contents,
      });
    }
  };

  const confirmPurchase = async (amount: number, description: string) => {
    setSubDialogConfig({
      dialogOpen: true,
      contents: <LoadingScreen message='Luodaan..' />
    });
    try {
      await createPurchase(amount, description);
      history.push('/')
    } catch (err) {
      const created = <>faild</>;
      setSubDialogConfig({
        dialogOpen: true,
        contents: created,
      });
    }
  };

  return (
    <Box height='100%' className='purchase-creator'>
      <TopBar />
      {modalConfig.contents && modalConfig.dialogOpen && 
        <Box
          className='modal'
          open={modalConfig.dialogOpen}
          onClose={() =>
            setSubDialogConfig({ ...modalConfig, dialogOpen: false })
          }
        >
          <Box>{modalConfig.contents}</Box>
        </Box>
      }

        <Container className='form-container'>
          <ManualPurchaseForm  requestConfirmPurchase={requestConfirmPurchase} />
        </Container>
       <Container bg="lighterDark" className='purchaseSelectorList'>
          <PurchaseSelector requestConfirmPurchase={requestConfirmPurchase} purchases={purchases} />
       </Container>
    </Box>
  );
});

export default PurchaseCreator;