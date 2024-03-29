import Select from "react-select";

const CustomSelect = ({
  defaultValue,
  onChange,
  options,
  value,
  placeholder,
  className,
  isSearchable = false,
  openMenuOnClick = true,
  menuIsOpen = undefined,
  isDisabled = false,
  styles = {}
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
        isSearchable={isSearchable}
        openMenuOnClick={openMenuOnClick}
        menuIsOpen={menuIsOpen}
        isDisabled={isDisabled}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            ...styles,
          }),
        }}
      />
    </>
  );
};

export default CustomSelect;