import { getDefect, isFaulty, isLoading } from "../../dataDefinitions/defect";

const withValidEntities = (entities) => (WrappedComponent) => (props) => {
  const data = entities(props);
  const faultyEntity = data.find(isFaulty);
  if (faultyEntity) return <div>{getDefect(faultyEntity)}</div>;

  const loadingEntity = data.find(isLoading);
  if (loadingEntity) return <div>loading</div>;

  return <WrappedComponent {...props} />;
};

export default withValidEntities;
