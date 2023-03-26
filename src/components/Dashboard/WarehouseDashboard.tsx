import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { OnResultFunction, QrReader } from "react-qr-reader";
import { useMetamaskAuth } from "../../auth/authConfig";
import AccountInfo from "./AccountInfo";
import { Container, LeftContainer, RightContainer } from "./dashboard.styled";
import InWarehouse from "./Warehouse/InWarehouse";
import PastWarehouse from "./Warehouse/PastWarehouse";
import { Button, Modal } from "@mui/material";
import { productIdentifierToDetails } from "../../utils/general";
import { GetProductLotWithCheckpoints, GetWarehouseProductLotsWithCheckpoints } from "../../apis/apis";
import { ProductLot, ProductLotWithCheckpoints } from "./productTypes";
import ProductPreviewModal from "./Warehouse/ProductPrevieModal";
import { toast } from "react-toastify";

enum SECTIONS {
  IN_WAREHOUSE = "IN_WAREHOUSE",
  PAST_LOTS = "PAST_LOTS",
}
const WarehouseDashboard = () => {
  const { isLoggedIn, isProcessingLogin, profile, refreshAuthStatus } =
    useMetamaskAuth();
  const [selectedSection, setSelectedSection] = useState<SECTIONS>(
    SECTIONS.IN_WAREHOUSE
  );
  const [scanning, setScanning] = useState(false);
  const [previewProductLot, setPreviewProductLot] = useState<ProductLotWithCheckpoints | null>(null);
  const ref = useRef(null);
  const [loading, setLoading] = useState(false);
  const [warehouseLots, setWarehouseLots] = useState<ProductLotWithCheckpoints[]>([]);
  
  const handleScan: OnResultFunction = (data) => {
    if (!data) return;
    if (window.prevText == data.getText()) return;

    console.log("Scanned text", data.getText());
    window.prevText = data.getText();
    if (ref && ref.current) {
      (ref.current as any)?.stop();
      (ref.current as any)?.stopCamera();
    }
    // navigator.mediaDevices.getUserMedia({ video: true })
    //   .then(function(stream) {
    //     console.log("Streams", stream.getTracks());
    //       stream.getTracks()
    //           .forEach(track => track.stop());
    //   })

    const details = productIdentifierToDetails(data.getText());
    console.log("Fetch", details);
    GetProductLotWithCheckpoints(details.producer, details.id)
      .then((lot) => {
        console.log("Product lot: ", lot);
        setPreviewProductLot(lot);
        setScanning(false);
      })
      .catch((err) => {
        console.log("Err fetching product lot", err);
        toast.error("Invalid product lot !");
        setScanning(false);
        setTimeout(() => window.location.reload(), 1000);
      });
  };
  function closeProductLotPreview() {
    setPreviewProductLot(null);
    window.location.reload();
  }
  
  useEffect(() => {
    if(!profile)  return;
    setLoading(true);
    GetWarehouseProductLotsWithCheckpoints(profile.id)
      .then(lots => {
        console.log("Warehouse lots", lots);
        setWarehouseLots(lots)
        setLoading(false);
      })
      .catch(err => {
        toast.error("Some error fetching product lots of warehouse !");
        setLoading(false);
      })

  }, [profile]);

  return (
    <div className="px-4">
      <Head>
        <title>Dashboard</title>
      </Head>
      {/* <h1 className="text-2xl font-bold">Dashboard</h1> */}
      <br />
      <div className="flex flex-row h-[calc(100vh-55px)] overflow-hidden box-borderr">
        <Container>
          <LeftContainer>
            <AccountInfo />
            <br />
            <Button
              variant="contained"
              onClick={() => {
                setScanning(true);
                window.prevText = "gg";
              }}
            >
              New product <span className="pl-3 text-2xl">+</span>
            </Button>
          </LeftContainer>
          <RightContainer>
            <div className="w-[100%] h-[100%] overflow-hidden">
              <div className="flex flex-row bg-[#fafeff] w-fit self-center m-auto rounded-md cursor-pointer ">
                {[
                  { name: "In warehouse", id: SECTIONS.IN_WAREHOUSE },
                  { name: "Previous lots", id: SECTIONS.PAST_LOTS },
                ].map((section) => {
                  const isSelected = selectedSection === section.id;
                  return (
                    <div
                      className={`w-[200px] rounded-md text-center ${
                        isSelected
                          ? "bg-[#73f3fe] transition-colors duration-200 ease-in-out "
                          : "text-gray-800 hover:bg-[#cff8fb]"
                      }`}
                      key={section.id}
                      onClick={() => setSelectedSection(section.id)}
                    >
                      {section.name}
                    </div>
                  );
                })}
              </div>
              <div className="w-[100%] h-auto max-h-[calc(100vh-199px)] rounded-xl overflow-auto">
                {selectedSection == SECTIONS.IN_WAREHOUSE ? (
                  <></>
                  // <InWarehouse />
                ) : (
                  <></>
                  // <PastWarehouse />
                )}
              </div>
            </div>
          </RightContainer>
        </Container>
      </div>
      <div>
        {scanning && (
          <div className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen text-center sm:block">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <div
                className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="bg-white">
                  <QrReader
                    constraints={{}}
                    scanDelay={300}
                    onResult={handleScan}
                    videoStyle={{ width: "100%" }}
                    // ref={ref}
                  />
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => setScanning(false)}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {previewProductLot && (
          <>
            <ProductPreviewModal
              closeModal={closeProductLotPreview}
              productLot={previewProductLot}
            />
          </>
        )}
        {/* <GMap locations={locations} /> */}
      </div>
    </div>
  );
};

export default WarehouseDashboard;
// export default withAuthenticatedRoute(WarehouseDashboard);
