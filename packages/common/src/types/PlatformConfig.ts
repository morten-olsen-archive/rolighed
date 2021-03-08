import Platform from "../Platform";
import PlatformApi from "./PlatformApi";

interface PlatformConfig {
  pkg: string | (new (api: PlatformApi) => Platform);
  config?: any;
}

export default PlatformConfig;
