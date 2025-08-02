import { useState } from "react";
import CustomInput from "./CustomInput";

function CustomInput_c() {
  const [inputs, setInputs] = useState([
    { id: 1, text: "첫 번째", detail: "상세1" },
    { id: 2, text: "두 번째", detail: "상세2" },
  ]);

  const handleDelete = (id) => {
    setInputs((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div>
      {inputs.map(({ id, text, detail }) => (
        <CustomInput
          key={id}
          text={text}
          initialDetailText={detail}
          onDelete={() => handleDelete(id)}
        />
      ))}
    </div>
  );
}

export default CustomInput_c;
