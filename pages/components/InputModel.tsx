import React from "react";
import { motion } from "framer-motion";

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  type: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  inputFields: InputFieldProps[];
  onSubmit: (e: React.FormEvent) => void;
  submitButtonLabel: string;
}

const InputModel: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  inputFields,
  onSubmit,
  submitButtonLabel,
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
          ></motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
          >
            <div className="relative w-auto max-w-3xl mx-auto my-6">
              <div className="rounded-2xl relative bg-black flex flex-col w-full border-0 shadow-lg outline-none focus:outline-none">
                <div className="flex items-center justify-between p-10 border-b border-solid border-blueGray-200 rounded-t">
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
                <div className="relative p-20 flex-auto">
                  <form onSubmit={onSubmit}>
                    {inputFields.map((field, index) => (
                      <div key={index} className="mb-8">
                        <div className="flex items-center justify-center m-4">
                          <label htmlFor={field.name} className="w-[50%]">
                            {field.label}:
                          </label>
                          <input
                            id={field.name}
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            type={field.type}
                            className="px-10 py-2 bg-transparent border border-slate-500 rounded-2xl mx-2"
                          />
                        </div>
                        {field.error && (
                          <div className="text-red-600 text-center">
                            {field.error}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="w-[100%]">
                      <button
                        type="submit"
                        className="border border-slate-400 hover:bg-slate-400 rounded-2xl w-full py-4 my-3"
                      >
                        {submitButtonLabel}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default InputModel;
