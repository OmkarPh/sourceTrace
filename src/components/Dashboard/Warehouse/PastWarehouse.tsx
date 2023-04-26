import axios from "axios";
import React, { useState } from "react";
import { useMetamaskAuth } from "../../../auth/authConfig";
import { timestampToDate } from "../../../utils/general";
import Loader from "../../core/Loader";
import { ProductLotWithCheckpoints } from "../productTypes";
import ProductPreviewModal from "./ProductLotPrevieModal";
import ValidityLabel from "../../core/ValidityLabel";

interface PastWarehouseProps {
  productLots: ProductLotWithCheckpoints[];
}

const PastWarehouse = (props: PastWarehouseProps) => {
  const { productLots } = props;
  const { profile, isProcessingLogin } = useMetamaskAuth();
  const [previewProductLot, setPreviewProductLot] =
    useState<ProductLotWithCheckpoints | null>(null);

  if (isProcessingLogin) return <Loader size={50} />;

  return (
    <div className="container mx-auto">
      {/* <h1 className="text-2xl font-bold mb-5">Product List</h1> */}
      <div className="bg-white rounded-lg shadow">
        <table className="w-full table-fixed">
          <thead className="bg-gray-200">
            <tr>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Product
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Quantity
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Production Date
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Current status
              </th>
              <th className="w-1/4 py-3 px-4 text-left font-semibold">
                Checked out
              </th>
            </tr>
          </thead>
          <tbody>
            {productLots.map((productLot) => {
              const isInFactory =
                productLot.checkpoints.length == 1 &&
                Number(productLot.checkpoints[0].outTime) == 0;
              const lastCheckpoint =
                productLot.checkpoints[productLot.checkpoints.length - 1];
              const isWarehouseLast = lastCheckpoint.warehouse.id === profile?.id;

              return (
                <tr
                  key={productLot.producerAddress + productLot.productLotId}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => setPreviewProductLot(productLot)}
                >
                  <td className="py-3 px-4">{productLot.productInfo.name}</td>
                  <td className="py-3 px-4">{productLot.quantity}</td>
                  <td className="py-3 px-4">
                    {timestampToDate(productLot.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    {productLot.rejected && productLot.rejection ? (
                      <>
                        Rejected by{" "}
                        {productLot.rejection.rejectedByWarehouse?.name}
                      </>
                    ) : (
                      <>
                        At{" "}
                        {
                          productLot.checkpoints[
                            productLot.checkpoints.length - 1
                          ].warehouse.name
                        }
                      </>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {timestampToDate(
                      productLot.checkpoints.find(
                        (checkpoint) => checkpoint.warehouse.id == profile?.id
                      )?.outTime || ""
                    ).toLocaleDateString()}
                    {productLot.rejected && (
                      <>
                        <br />
                        {
                          isWarehouseLast ?
                          <ValidityLabel valid={false} inValidText={`Rejected`} />
                          : "Returned"
                        }
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {previewProductLot && (
        <>
          <ProductPreviewModal
            closeModal={() => setPreviewProductLot(null)}
            productLot={previewProductLot}
            noActions
          />
        </>
      )}
    </div>
  );
};

export default PastWarehouse;
