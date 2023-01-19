import { FormControl, FormLabel } from "@chakra-ui/react";
import { AsyncSelect } from "chakra-react-select";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { ISelectOption } from "../../../libs/interfaces";

interface Props {
  label: string;
  url: string;
  placeholder: string;
  mapping: (a: any) => ISelectOption[];
  onChange: Function;
}
function AsyncSelectControl({
  label,
  url,
  mapping,
  placeholder,
  onChange,
}: Props) {
  const axiosPrivate = useAxiosPrivate();
  const fetch = async (key: string) => {
    if (url && key) {
      try {
        const response = await axiosPrivate.get(
          `${process.env.API_URL}${url}?key=${key}`
        );
        const data = await response.data;
        return mapping(data);
      } catch (err: any) {
        return [];
      }
    } else return [];
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<ISelectOption[]>((resolve) => {
      setTimeout(() => {
        resolve(fetch(inputValue));
      }, 500);
    });

  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <AsyncSelect
        placeholder={placeholder}
        loadOptions={promiseOptions}
        onChange={(option) => {
          onChange(option?.value);
        }}
      />
    </FormControl>
  );
}

export default AsyncSelectControl;
