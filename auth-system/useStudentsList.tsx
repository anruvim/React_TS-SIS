/**
 * Custom hook to fetch and manage a list of students with pagination and filtering.
 *
 * @returns {Object} - The hook returns an object containing:
 * - `loading` {boolean}: Indicates if the data is currently being loaded.
 * - `data` {IStudentUser[] | undefined}: The list of student users.
 * - `mutate` {Function}: Function to mutate or revalidate the SWR data.
 *
 * @interface IStudentsFilter
 * @property {string | number} [academic_field_id] - Filter by academic field ID.
 * @property {string} [status] - Filter by student status.
 * @property {string} [citizenship] - Filter by student citizenship.
 * @property {string} [nationality] - Filter by student nationality.
 * @property {string} [year] - Filter by academic year.
 * @property {string} [key] - Additional filter key.
 */
export interface IStudentsFilter {
  academic_field_id?: string | number;
  status?: string;
  citizenship?: string;
  nationality?: string;
  year?: string;
  key?: string;
}
export default function useStudentsList() {
  const axiosPrivate = useAxiosPrivate();
  const { pagePropsString, filtersString, setPagination } =
    usePagination<IStudentsFilter>();
    const { data, mutate, isLoading } = useSWR<{
    student_users: IStudentUser[];
    pagination: IPagination;
  }>(
    [
      `${process.env.API_URL}/academic/student/all?${pagePropsString}&${filtersString}`,
      axiosPrivate,
    ],
    DefaultFetcher
  );
  useEffect(() => {
    if (data?.pagination) {
      setPagination(data?.pagination);
    }
  }, [data?.pagination]);
  return {
    loading: isLoading,
    data: data?.student_users,
    mutate: mutate,
  };
}
