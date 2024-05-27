class K8sNavigator < Formula
  desc "K8s Navigator is a tool for navigating Kubernetes clusters"
  homepage "https://github.com/yourusername/k8s-navigator"
  url "https://storage.googleapis.com/k8s-navigator-bucket/k8s-navigator-darwin-arm64-2.0.0.zip"
  sha256 "d4a5370646df0b5e6171c1ea4daf53aa7503e931d12c6b86cb87db36dcde2cd0"
  license "MIT"

  depends_on "node"

  def install
    # Extract the main executable from the .app bundle
    system "unzip", "k8s-navigator-darwin-arm64-2.0.0.zip"
    bin.install "k8s-navigator.app/Contents/MacOS/k8s-navigator"
  end

  test do
    system "#{bin}/k8s-navigator", "--version"
  end
end
