import { useLoaderData } from "react-router-dom"
import { AwsIdcCard } from "../providers/aws-idc/card"
import { main } from "../../../wailsjs/go/models"
import { ProviderCodes } from "../../utils/provider-sink-codes"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ProviderComponentMap = new Map<string, React.FC<any>>([
  [ProviderCodes.AwsIdc, AwsIdcCard],
])

export function Dashboard() {
  const favoriteInstances = useLoaderData() as main.FavoriteInstance[]

  return (
    <>
      {...favoriteInstances.map((favorite) => {
        const Component = ProviderComponentMap.get(favorite.providerCode)
        if (!Component) {
          throw new Error(
            `No component found for provider of type [${favorite.providerCode}] and ID [${favorite.instanceId}]`,
          )
        }
        return (
          <Component
            key={favorite.instanceId}
            {...favorite}
          />
        )
      })}
    </>
  )
}
