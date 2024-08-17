import React, { ReactNode } from "react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}
import { motion } from "framer-motion";
const InputModel: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            
            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto bg-black bg-opacity-50"
          >
            {/* Background overlay with fade effect */}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
           
            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
          >
            <div className="relative w-auto max-w-3xl mx-auto my-6">
              <div className="  rounded-2xl relative bg-black  flex flex-col w-full  border-0  shadow-lg outline-none focus:outline-none">
                <div className="flex items-center justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-lg font-semibold text-white flex-grow text-center">
                    {title}
                  </h3>

                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="text-white h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">{children}</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default InputModel;
