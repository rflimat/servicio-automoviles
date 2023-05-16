import Select from "react-select";

const CustomSelect = ({
  defaultValue,
  onChange,
  options,
  value,
  placeholder,
  className,
}) => {
  const listValues = (options, value) => {
    return options ? options.find((option) => option.value === value) : "";
  };

  return (
    <>
      <Select
        defaultValue={defaultValue}
        value={listValues(options, value)}
        onChange={(value) => onChange(value)}
        options={options}
        placeholder={placeholder}
        className={className}
        isSearchable={false}
      />
    </>
  );
};

export default CustomSelect;