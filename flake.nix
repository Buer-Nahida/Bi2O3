{
  description = "My Awesome Desktop Shell";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    astal = {
      url = "github:aylur/astal/main";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:aylur/ags";
      inputs = {
        nixpkgs.follows = "nixpkgs";
        astal.follows = "astal";
      };
    };
  };

  outputs = { nixpkgs, ags, ... }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs { inherit system; };
    in {
      packages.${system}.default = ags.lib.bundle {
        inherit pkgs;
        src = ./.;
        name = "Bi2O3";
        entry = "app.ts";
        extraPackages = with ags.packages.${system}; [ mpris notifd tray ];
      };

      devShells.${system} = {
        default =
          pkgs.mkShell { buildInputs = [ ags.packages.${system}.agsFull ]; };
      };
    };
}
